import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DRIVE_FILE_URL_REGEX =
  /^https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/.*)?/;

/**
 * Resolves a catalog file/pdf field to a URL. The sheet may store either a full URL
 * (e.g. Google Drive link) or a legacy Drive file ID (proxied via /api/assets/).
 * Use this for links (e.g. PDF "open in new tab") so the stored URL is used as-is.
 */
export function getAssetUrl(value: string | undefined): string {
  if (!value?.trim()) return '';
  const v = value.trim();
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `/api/assets/${v}`;
}

/**
 * Resolves a catalog file field to a URL suitable for <img src>. Drive "view" URLs
 * return HTML, not image bytes, so we extract the file ID and use our proxy for images.
 * Otherwise delegates to getAssetUrl.
 */
export function getAssetImageSrc(value: string | undefined): string {
  const url = getAssetUrl(value);
  if (!url) return '';
  const driveMatch = url.match(DRIVE_FILE_URL_REGEX);
  if (driveMatch) return `/api/assets/${driveMatch[1]}`;
  return url;
}
