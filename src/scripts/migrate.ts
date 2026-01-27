import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { google, drive_v3, sheets_v4 } from 'googleapis';
import { createReadStream } from 'fs';

// Load environment variables from .env
dotenv.config();

/**
 * Metadata for a single preview image or PDF.
 */
interface LegacyPreview {
  src: string;
  alt: string;
  pdf?: string;
}

/**
 * A raw item as it appears in the legacy catalog.json.
 */
interface LegacyCatalogItem {
  formId: string;
  description: string;
  size: string;
  paper: string;
  color: string;
  sides: string;
  unit: string;
  category: string;
  previews: LegacyPreview[];
}

/**
 * A cleaned and flattened catalog item ready for Google Sheets.
 */
interface NormalizedCatalogItem {
  formId: string;
  category: string;
  description: string;
  size: string;
  paper: string;
  color: string;
  sides: string;
  unit: string;
  file0: string;
  file1: string;
  pdf0: string;
}

/**
 * Tracking object for resumable migration runs.
 */
interface Checkpoint {
  processedFormIds: string[];
  lastUpdated: string;
}

/**
 * Path to the source legacy catalog JSON.
 */
const LEGACY_CATALOG_PATH = path.join(process.cwd(), 'legacy', 'catalog.json');

/**
 * Path to the migration checkpoint file.
 */
const CHECKPOINT_PATH =
  process.env.CHECKPOINT_PATH || path.join(process.cwd(), 'checkpoint.json');

/**
 * Path to the Google Service Account credentials.
 */
const SERVICE_ACCOUNT_PATH =
  process.env.SERVICE_ACCOUNT_PATH ||
  path.join(process.cwd(), 'service-account.json');

/**
 * List of CLI arguments.
 */
const args = process.argv.slice(2);

/**
 * Flag indicating whether to perform a dry run.
 */
const DRY_RUN = args.includes('--dry-run') || !args.includes('--no-dry-run');

/**
 * Google API authorization scopes.
 */
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

/**
 * List of headers expected in the destination Google Sheet.
 */
const EXPECTED_HEADERS = [
  'formId',
  'category',
  'description',
  'size',
  'paper',
  'color',
  'sides',
  'unit',
  'file0',
  'file1',
  'pdf0',
];

/**
 * Path to the user OAuth2 tokens.
 */
const TOKEN_PATH =
  process.env.TOKEN_PATH || path.join(process.cwd(), 'tokens.json');

let drive: drive_v3.Drive;
let sheets: sheets_v4.Sheets;

/**
 * Initializes Google API clients using either tokens.json (User OAuth2) or service-account.json.
 */
async function initializeClients() {
  if (await fs.pathExists(TOKEN_PATH)) {
    console.log('Using User OAuth2 authentication (tokens.json).');
    const tokens = await fs.readJson(TOKEN_PATH);
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials(tokens);
    drive = google.drive({ version: 'v3', auth: oauth2Client });
    sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    return;
  }

  console.log('Using Service Account authentication (service-account.json).');
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: SCOPES,
  });
  drive = google.drive({ version: 'v3', auth });
  sheets = google.sheets({ version: 'v4', auth });
}

/**
 * Maps legacy catalog items to the flattened schema.
 */
function normalizeData(
  legacyItems: LegacyCatalogItem[]
): NormalizedCatalogItem[] {
  return legacyItems.map((item) => {
    const file0 = item.previews.at(0)?.src || '';
    const file1 = item.previews.at(1)?.src || '';
    const pdf0 = item.previews.at(0)?.pdf || item.previews.at(1)?.pdf || '';

    return {
      formId: item.formId,
      category: item.category,
      description: item.description,
      size: item.size,
      paper: item.paper,
      color: item.color,
      sides: item.sides,
      unit: item.unit,
      file0,
      file1,
      pdf0,
    };
  });
}

/**
 * Reads the checkpoint file from disk.
 */
async function loadCheckpoint(): Promise<Checkpoint> {
  if (await fs.pathExists(CHECKPOINT_PATH)) {
    return fs.readJson(CHECKPOINT_PATH);
  }
  return { processedFormIds: [], lastUpdated: new Date().toISOString() };
}

/**
 * Writes the current migration progress to disk.
 */
async function saveCheckpoint(checkpoint: Checkpoint) {
  checkpoint.lastUpdated = new Date().toISOString();
  await fs.writeJson(CHECKPOINT_PATH, checkpoint, { spaces: 2 });
}

/**
 * Validates that destinations are empty and headers match the schema.
 */
async function checkDestinationsNotEmpty() {
  const sheetId = process.env.DRIVE_SHEET_ID;
  const folderId = process.env.DRIVE_FOLDER_ID;

  if (!sheetId || !folderId) {
    throw new Error('DRIVE_SHEET_ID and DRIVE_FOLDER_ID must be set in .env');
  }

  if (DRY_RUN) {
    console.log('[Dry Run] Destination and header check skipped.');
    return;
  }

  console.log('Verifying destinations and headers...');

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1:K1',
  });

  const actualHeaders = headerRes.data.values?.[0] || [];
  const headersMatch =
    actualHeaders.length === EXPECTED_HEADERS.length &&
    EXPECTED_HEADERS.every((h, i) => actualHeaders[i] === h);

  if (!headersMatch) {
    throw new Error(
      `Invalid headers in Google Sheet.\nExpected: ${EXPECTED_HEADERS.join(', ')}\nActual:   ${actualHeaders.join(', ')}`
    );
  }

  const sheetRes = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:A2',
  });

  const driveRes = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    pageSize: 1,
    fields: 'files(id)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  if (
    (sheetRes.data.values && sheetRes.data.values.length > 0) ||
    (driveRes.data.files && driveRes.data.files.length > 0)
  ) {
    // If we're resuming (checkpoint file exists), we allow the destination to be non-empty
    if (await fs.pathExists(CHECKPOINT_PATH)) {
      console.log(
        '  Destination is not empty, but checkpoint exists. Resuming...'
      );
      return;
    }

    throw new Error(
      'Destination is not empty! Please clear the Drive folder and Sheet data before running migration.'
    );
  }

  console.log('  Destinations and headers verified successfully.');
}

/**
 * Synchronizes an asset file to Google Drive.
 */
async function uploadToDrive(filePath: string, folderId: string) {
  const fileName = path.basename(filePath);
  const fullPath = path.join(process.cwd(), 'legacy', filePath);

  if (DRY_RUN) {
    console.log(`  [Dry Run] Uploading ${filePath} to Drive...`);
    return `DRIVE_ID_${fileName}`;
  }

  if (!(await fs.pathExists(fullPath))) {
    console.warn(
      `  [Warning] Asset not found at path: ${fullPath}. Skipping upload.`
    );
    return '';
  }

  const existing = await drive.files.list({
    q: `name = '${fileName}' and '${folderId}' in parents and trashed = false`,
    fields: 'files(id)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const mimeType = fileName.endsWith('.webp')
    ? 'image/webp'
    : fileName.endsWith('.pdf')
      ? 'application/pdf'
      : 'application/octet-stream';

  const media = {
    mimeType,
    body: createReadStream(fullPath),
  };

  let fileId: string;

  if (existing.data.files?.length) {
    fileId = existing.data.files[0].id!;
    await drive.files.update({ fileId, media, supportsAllDrives: true });
    console.log(`  Updated existing asset: ${fileName}`);
  } else {
    const res = await drive.files.create({
      requestBody: { name: fileName, parents: [folderId] },
      media,
      fields: 'id',
      supportsAllDrives: true,
    });
    fileId = res.data.id!;
    console.log(`  Uploaded new asset: ${fileName}`);
  }

  return fileId;
}

/**
 * Appends normalized item data to the Google Sheet.
 */
async function appendToGoogleSheet(
  sheetId: string,
  item: NormalizedCatalogItem
) {
  if (DRY_RUN) return;

  const rowData = [
    item.formId,
    item.category,
    item.description,
    item.size,
    item.paper,
    item.color,
    item.sides,
    item.unit,
    item.file0,
    item.file1,
    item.pdf0,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [rowData],
    },
  });
}

/**
 * Executes the full end-to-end migration flow.
 */
async function main() {
  console.log('--- Starting Data Migration ---');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'}`);

  try {
    const sheetId = process.env.DRIVE_SHEET_ID;
    const folderId = process.env.DRIVE_FOLDER_ID;

    // Initialize Google API Clients
    await initializeClients();

    await checkDestinationsNotEmpty();

    if (!(await fs.pathExists(LEGACY_CATALOG_PATH))) {
      throw new Error(`Catalog source not found at: ${LEGACY_CATALOG_PATH}`);
    }
    const legacyData: LegacyCatalogItem[] =
      await fs.readJson(LEGACY_CATALOG_PATH);
    console.log(`Successfully loaded ${legacyData.length} legacy items.`);

    const checkpoint = await loadCheckpoint();
    if (checkpoint.processedFormIds.length > 0) {
      console.log(
        `Resuming: ${checkpoint.processedFormIds.length} items already processed.`
      );
    }

    const normalizedData = normalizeData(legacyData);

    for (let i = 0; i < normalizedData.length; i++) {
      const item = normalizedData[i];
      if (checkpoint.processedFormIds.includes(item.formId)) continue;

      console.log(
        `[${i + 1}/${normalizedData.length}] Migrating ${item.formId}...`
      );

      const file0Id = item.file0
        ? await uploadToDrive(item.file0, folderId!)
        : '';
      const file1Id = item.file1
        ? await uploadToDrive(item.file1, folderId!)
        : '';
      const pdf0Id = item.pdf0 ? await uploadToDrive(item.pdf0, folderId!) : '';

      await appendToGoogleSheet(sheetId!, {
        ...item,
        file0: file0Id,
        file1: file1Id,
        pdf0: pdf0Id,
      });

      checkpoint.processedFormIds.push(item.formId);
      await saveCheckpoint(checkpoint);

      console.log(`  Done with ${item.formId}.`);
    }

    console.log('--- Migration Completed Successfully ---');
    if (await fs.pathExists(CHECKPOINT_PATH)) {
      await fs.remove(CHECKPOINT_PATH);
      console.log('Checkpoint file cleared.');
    }
  } catch (error) {
    console.error('\n!!! Migration failed !!!');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
