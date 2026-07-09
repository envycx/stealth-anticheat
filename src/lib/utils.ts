import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes without style conflicts.
 * Combines clsx (conditional class logic) with tailwind-merge (deduplication).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a Date to a human-readable string.
 * Default output: "Jan 15, 2024"
 * Supports custom Intl.DateTimeFormatOptions.
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Truncate a string to maxLength characters.
 * Appends "..." if the string exceeds maxLength.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Mask a HWID string for safe display.
 * Shows the first 4 and last 4 characters separated by "...".
 * Returns the string as-is if it is 8 characters or fewer.
 *
 * Example: "A1B2C3D4E5F6G7H8" → "A1B2...G7H8"
 */
export function maskHwid(hwid: string): string {
  if (hwid.length <= 8) return hwid;
  return `${hwid.slice(0, 4)}...${hwid.slice(-4)}`;
}

/**
 * Format a raw license key into STLTH-XXXX-XXXX-XXXX-XXXX display format.
 * If the key already contains dashes, it is returned as-is.
 * Otherwise, strips all non-alphanumeric characters and inserts dashes
 * after the 5-character prefix and then every 4 characters.
 *
 * Example: "STLTH1234ABCD5678EFGH" → "STLTH-1234-ABCD-5678-EFGH"
 */
export function formatLicenseKey(key: string): string {
  if (key.includes('-')) return key;

  const clean = key.replace(/[^a-zA-Z0-9]/g, '');
  const prefix = clean.slice(0, 5);
  const rest = clean.slice(5);

  const segments: string[] = [];
  for (let i = 0; i < rest.length; i += 4) {
    segments.push(rest.slice(i, i + 4));
  }

  return [prefix, ...segments].join('-');
}
