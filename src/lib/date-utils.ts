/**
 * Parse a UTC ISO string and return a local Date at midnight on the same calendar date.
 * This avoids timezone shifts from date-fns format() / toLocaleDateString().
 * E.g. "2026-06-09T00:00:00.000Z" → new Date(2026, 5, 9) regardless of browser timezone.
 */
export function toLocalDate(isoStr: string | null | undefined): Date | null {
  if (!isoStr) return null;
  const parts = isoStr.slice(0, 10).split("-");
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(y, m - 1, d);
}

/**
 * Convert an HTML date input value (yyyy-MM-dd) to a UTC ISO string for storage.
 * new Date("2026-06-09") is parsed as midnight UTC per ECMAScript spec.
 */
export function inputToUtc(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString();
}

/**
 * Extract the yyyy-MM-dd portion from a UTC ISO string (no timezone conversion).
 */
export function toDateInputValue(isoStr: string | null | undefined): string {
  if (!isoStr) return "";
  return isoStr.slice(0, 10);
}
