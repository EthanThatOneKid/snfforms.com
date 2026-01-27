import { google } from 'googleapis';
import path from 'path';

/**
 * A normalized catalog item following the DESIGN.md schema.
 */
export interface NormalizedCatalogItem {
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

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

/**
 * Initializes and returns a Google Sheets client using the service account.
 */
export async function getSheetsClient() {
  const serviceAccountPath =
    process.env.SERVICE_ACCOUNT_PATH ||
    path.join(process.cwd(), 'service-account.json');

  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Fetches all forms from the configured Google Sheet.
 */
export async function getForms(): Promise<NormalizedCatalogItem[]> {
  const sheetId = process.env.DRIVE_SHEET_ID;
  if (!sheetId) {
    throw new Error('DRIVE_SHEET_ID is not set in environment variables');
  }

  const sheets = await getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:K', // Assumes headers are in row 1
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((row) => ({
    formId: row[0] || '',
    category: row[1] || '',
    description: row[2] || '',
    size: row[3] || '',
    paper: row[4] || '',
    color: row[5] || '',
    sides: row[6] || '',
    unit: row[7] || '',
    file0: row[8] || '',
    file1: row[9] || '',
    pdf0: row[10] || '',
  }));
}
