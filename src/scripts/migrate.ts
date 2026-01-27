import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

/**
 * Migration Config & Types
 */
interface LegacyPreview {
  src: string;
  alt: string;
  pdf?: string;
}

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

const LEGACY_CATALOG_PATH = path.join(process.cwd(), 'legacy', 'catalog.json');
const DRY_RUN = process.env.DRY_RUN !== 'false';

/**
 * Normalizes legacy catalog data into the new schema.
 */
function normalizeData(legacyItems: LegacyCatalogItem[]): NormalizedCatalogItem[] {
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
 * Placeholder for Google Drive Upload Logic
 */
async function uploadToDrive(filePath: string) {
  if (DRY_RUN) {
    console.log(`[Dry Run] Uploading ${filePath} to Google Drive...`);
    return 'DRIVE_FILE_ID_PLACEHOLDER';
  }
  // TODO: Implement actual Google Drive API upload
  return 'DRIVE_FILE_ID';
}

/**
 * Placeholder for Google Sheets Population Logic
 */
async function updateGoogleSheet(data: NormalizedCatalogItem[]) {
  if (DRY_RUN) {
    console.log(`[Dry Run] Populating Google Sheet with ${data.length} items...`);
    console.log('Sample Data (First 2):', data.slice(0, 2));
    return;
  }
  // TODO: Implement actual Google Sheets API update
}

/**
 * Main Migration Flow
 */
async function main() {
  console.log('--- Starting Data Migration ---');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'}`);

  try {
    // 1. Read Legacy Data
    if (!(await fs.pathExists(LEGACY_CATALOG_PATH))) {
      throw new Error(`Legacy catalog not found at ${LEGACY_CATALOG_PATH}`);
    }
    const legacyData: LegacyCatalogItem[] = await fs.readJson(LEGACY_CATALOG_PATH);
    console.log(`Successfully loaded ${legacyData.length} legacy items.`);

    // 2. Normalize Data
    const normalizedData = normalizeData(legacyData);
    console.log('Data normalization complete.');

    // 3. Asset Migration (Optional/Future)
    // Here logic would go to iterate through normalizedData and upload file0, file1, pdf0 to Drive
    // if they haven't been uploaded yet.

    // 4. Update Google Sheet
    await updateGoogleSheet(normalizedData);

    console.log('--- Migration Completed Successfully ---');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
