import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Path where tokens will be saved.
 */
const TOKEN_PATH = path.join(process.cwd(), 'tokens.json');

/**
 * Scopes required for migration.
 */
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

/**
 * Executes the OAuth2 flow to generate a tokens.json file.
 */
async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:3000/oauth2callback'
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Ensure we get a refresh token
  });

  console.log('\n--- Google OAuth2 Setup ---');
  console.log('1. Open the following URL in your browser:\n');
  console.log(authUrl);
  console.log('\n2. Log in and authorize the application.');
  console.log('3. The script will automatically catch the code and save tokens.json.\n');

  const server = http.createServer(async (req, res) => {
    try {
      if (req.url?.startsWith('/oauth2callback')) {
        const q = url.parse(req.url, true).query;
        const code = q.code as string;

        res.end('Authentication successful! You can close this window and return to the terminal.');
        server.close();

        const { tokens } = await oauth2Client.getToken(code);
        await fs.writeJson(TOKEN_PATH, tokens, { spaces: 2 });
        
        console.log('Successfully saved tokens to tokens.json');
        process.exit(0);
      }
    } catch (e) {
      console.error('Error obtaining tokens:', e);
      res.end('Authentication failed.');
      process.exit(1);
    }
  }).listen(3000);
}

main().catch(console.error);
