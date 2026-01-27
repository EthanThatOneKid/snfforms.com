import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ asset: string }> }
) {
  try {
    const { asset } = await params;

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      );
    }

    const credentialsJson = process.env.GOOGLE_CREDENTIALS;
    if (!credentialsJson) {
      console.error('GOOGLE_CREDENTIALS is not set');
      return NextResponse.json(
        { error: 'Internal Server Error: Missing Credentials' },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentialsJson),
      scopes: SCOPES,
    });

    const drive = google.drive({ version: 'v3', auth });

    // Fetch file metadata to get the MIME type
    const fileMetadata = await drive.files.get({
      fileId: asset,
      fields: 'mimeType, name',
    });

    const mimeType = fileMetadata.data.mimeType || 'application/octet-stream';

    // Fetch file content as a stream
    const response = await drive.files.get(
      { fileId: asset, alt: 'media' },
      { responseType: 'stream' }
    );

    // Convert the Readable stream to a web-compatible stream
    const stream = new ReadableStream({
      start(controller) {
        response.data.on('data', (chunk) => controller.enqueue(chunk));
        response.data.on('end', () => controller.close());
        response.data.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching asset from Drive:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}
