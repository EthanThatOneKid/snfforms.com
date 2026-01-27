import { google } from 'googleapis';

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

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Initializes and returns a Google Sheets client using the service account.
 */
export async function getSheetsClient() {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS;

  if (!credentialsJson) {
    throw new Error(
      'GOOGLE_CREDENTIALS Is not set. Please add it to your environment variables.'
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentialsJson),
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

/**
 * Fetches a single form by ID.
 * Since the dataset is small, we reuse getForms() and filter.
 */
export async function getFormById(
  id: string
): Promise<NormalizedCatalogItem | undefined> {
  const forms = await getForms();
  return forms.find((f) => f.formId === id);
}

/**
 * Appends a new contact message to the contact sheet.
 */
export async function appendContactMessage(data: ContactFormData) {
  const sheetId = process.env.CONTACT_SHEET_ID;
  if (!sheetId) {
    throw new Error('CONTACT_SHEET_ID is not set in environment variables');
  }

  const sheets = await getSheetsClient();
  const timestamp = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:E', // Appends to the first 5 columns found
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[timestamp, data.name, data.email, data.phone, data.message]],
    },
  });
}
