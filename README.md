# snfforms.com

A real-time, user-friendly catalog of forms using Google Sheets as a lightweight
CMS and Google Drive for asset storage.

## Environment Variables

The migration script uses the following environment variables:

- `DRY_RUN`: Set to `false` to perform actual updates to Google Sheets/Drive.
  Defaults to `true`.

## Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Sync data from Google Sheets/Drive
npm run migrate
```

## Core Tech

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **CMS**: Google Sheets API
- **Assets**: Google Drive API
- **Styling**: Tailwind CSS

For more details on the architecture and data flow, see
[DESIGN.md](file:///c:/Users/ethan/Documents/GitHub/snfforms.com/DESIGN.md).
