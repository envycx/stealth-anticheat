import { describe, it, expect } from 'vitest';
import { cn, formatDate, truncate, maskHwid, formatLicenseKey } from '@/lib/utils';

// ---------------------------------------------------------------------------
// cn()
// ---------------------------------------------------------------------------

describe('cn()', () => {
  it('returns a single class as-is', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('joins multiple classes', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('omits falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('handles conditional object syntax', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo');
  });

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    // tailwind-merge should keep only the last conflicting utility
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });

  it('returns an empty string when no valid classes are provided', () => {
    expect(cn(false, undefined, null)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// formatDate()
// ---------------------------------------------------------------------------

describe('formatDate()', () => {
  it('formats a known date with default options', () => {
    // Use a fixed UTC date to avoid timezone ambiguity in the month/year
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatDate(date);
    // The output should include "2024" and "15"
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/15/);
  });

  it('includes the short month name in default output', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatDate(date);
    // Should contain a month abbreviation (Jan in en-US)
    expect(result).toMatch(/Jan/i);
  });

  it('respects custom options (year only)', () => {
    const date = new Date('2024-06-10T12:00:00Z');
    const result = formatDate(date, { year: 'numeric' });
    expect(result).toBe('2024');
  });

  it('respects custom options (numeric month and day)', () => {
    const date = new Date('2024-03-05T12:00:00Z');
    const result = formatDate(date, { month: 'numeric', day: 'numeric' });
    // en-US format: "3/5"
    expect(result).toBe('3/5');
  });
});

// ---------------------------------------------------------------------------
// truncate()
// ---------------------------------------------------------------------------

describe('truncate()', () => {
  it('returns the string as-is when length equals maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('returns the string as-is when shorter than maxLength', () => {
    expect(truncate('hi', 10)).toBe('hi');
  });

  it('truncates and appends "..." when longer than maxLength', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  it('handles maxLength of 0 (empty prefix + ellipsis)', () => {
    expect(truncate('abc', 0)).toBe('...');
  });

  it('handles an empty string without error', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('truncates to exactly maxLength characters before the ellipsis', () => {
    const result = truncate('abcdefghij', 4);
    expect(result).toBe('abcd...');
  });
});

// ---------------------------------------------------------------------------
// maskHwid()
// ---------------------------------------------------------------------------

describe('maskHwid()', () => {
  it('returns the string as-is when 8 characters or fewer', () => {
    expect(maskHwid('12345678')).toBe('12345678');
    expect(maskHwid('ABCD')).toBe('ABCD');
    expect(maskHwid('')).toBe('');
  });

  it('masks a typical 16-char HWID showing first 4 and last 4', () => {
    expect(maskHwid('A1B2C3D4E5F6G7H8')).toBe('A1B2...G7H8');
  });

  it('masks a longer HWID correctly', () => {
    expect(maskHwid('AABBCCDDEEFF0011')).toBe('AABB...0011');
  });

  it('handles exactly 9 characters (boundary above 8)', () => {
    expect(maskHwid('123456789')).toBe('1234...6789');
  });

  it('shows "..." separator between prefix and suffix', () => {
    const result = maskHwid('XXXXXXXXXXXX');
    expect(result).toContain('...');
    expect(result.startsWith('XXXX')).toBe(true);
    expect(result.endsWith('XXXX')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// formatLicenseKey()
// ---------------------------------------------------------------------------

describe('formatLicenseKey()', () => {
  it('returns a key that already contains dashes as-is', () => {
    const key = 'STLTH-1234-ABCD-5678-EFGH';
    expect(formatLicenseKey(key)).toBe(key);
  });

  it('formats a raw concatenated key into STLTH-XXXX-XXXX-XXXX-XXXX', () => {
    expect(formatLicenseKey('STLTH1234ABCD5678EFGH')).toBe('STLTH-1234-ABCD-5678-EFGH');
  });

  it('strips non-alphanumeric characters before formatting', () => {
    // Spaces and special chars should be stripped
    expect(formatLicenseKey('STLTH 1234 ABCD 5678 EFGH')).toBe('STLTH-1234-ABCD-5678-EFGH');
  });

  it('handles a key shorter than the full 21 chars gracefully', () => {
    // Only prefix + one partial segment
    const result = formatLicenseKey('STLTH12');
    expect(result).toBe('STLTH-12');
  });

  it('handles an empty string', () => {
    expect(formatLicenseKey('')).toBe('');
  });

  it('uses the first 5 chars as prefix and groups remaining in fours', () => {
    const result = formatLicenseKey('ABCDE12345678');
    // prefix: ABCDE, then 1234, 5678
    expect(result).toBe('ABCDE-1234-5678');
  });
});
