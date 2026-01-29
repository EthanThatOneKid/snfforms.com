# snfforms.com

[![Handbook](https://img.shields.io/badge/Project-Handbook-blue?style=flat-square&logo=google-docs&logoColor=white)](https://docs.google.com/document/d/1t5PCXuktJXC351yqyWOsuqGsvpBLBZEeYdFL7zvt3as/edit?tab=t.0)

A real-time, user-friendly catalog of forms using Google Sheets as a lightweight
CMS and Google Drive for asset storage.

## Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Sync data from Google Sheets/Drive
npm run migrate
```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DRIVE_SHEET_ID=your_google_sheet_id
DRIVE_FOLDER_ID=your_google_drive_folder_id
GOOGLE_CLIENT_ID=your_oauth_client_id
GOOGLE_CLIENT_SECRET=your_oauth_client_secret
CHECKPOINT_PATH=./checkpoint.json

# Contact Form
CONTACT_SHEET_ID=your_contact_sheet_id
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Email (Resend)
RESEND_API_KEY=re_123456789
CONTACT_EMAIL=your_email@example.com
FROM_EMAIL=Your Name <onboarding@resend.dev>
```

## Setup Guide

To get your migration script running, you need to set up your Google Cloud
project, generate an OAuth 2.0 Client ID, and extract the correct IDs from your
browser.

### 1. Procure Credentials (OAuth 2.0)

Since Service Accounts have 0GB storage quota, you must use **User OAuth2** for
personal Drive uploads.

1. **Create a Google Cloud Project:** Go to the
   [Google Cloud Console](https://console.cloud.google.com/), create a new
   project.
2. **Enable APIs:** Enable both the **Google Drive API** and the **Google Sheets
   API**.
3. **Configure OAuth Consent Screen:**
   - Go to **APIs & Services > OAuth consent screen**.
   - Choose **External**, fill in the required app name and support email.
   - Add the scopes: `.../auth/drive.file` and `.../auth/spreadsheets`.
   - Add your email as a
     [**Test User**](https://console.cloud.google.com/auth/audience?project=snfforms#:~:text=100%20user%20cap-,Test%20users,Add%20users,-Filter)
     (Important!).
4. **Create Credentials:**
   - Go to **APIs & Services > Credentials**.
   - Click **+ Create Credentials > OAuth client ID**.
   - Select **Desktop App**, name it, and click **Create**.
   - Copy the **Client ID** and **Client Secret** into your `.env` file.
5. **Authorize the App:**
   - Run `npm run auth` in your terminal.
   - Open the URL in your browser, log in, and authorize.
   - This will generate a `tokens.json` file in your root directory.

### 2. Identify Resource IDs

| Resource            | Where to find the ID in the URL                                         |
| ------------------- | ----------------------------------------------------------------------- |
| **Google Sheet ID** | `https://docs.google.com/spreadsheets/d/` **SPREADSHEET_ID** `/edit...` |
| **Drive Folder ID** | `https://drive.google.com/drive/folders/` **FOLDER_ID**                 |

### 3. Running the Migration

The migration script uses the credentials above to sync data.

```bash
# Dry run (default)
npm run migrate -- --dry-run

# Production run (Caution: overwrites destination if not empty)
npm run migrate -- --no-dry-run
```

## Core Tech

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **CMS**: Google Sheets API
- **Assets**: Google Drive API
- **Styling**: Tailwind CSS
- **Email**: Resend

For more details on the architecture and data flow, see
[DESIGN.md](file:///c:/Users/ethan/Documents/GitHub/snfforms.com/DESIGN.md).
