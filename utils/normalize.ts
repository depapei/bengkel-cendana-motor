/** 0812-3456 7890 / +62812... / 62812... → 081234567890 */
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("62") ? `0${digits.slice(2)}` : digits;
}

/** "  honda   vario " → "HONDA VARIO" (trim, rapikan spasi, kapital semua) */
export function normalizeUpper(value: string): string {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

/** "b 1234  abc" → "B 1234 ABC" */
export const normalizePlat = normalizeUpper;

/** 081234567890 → 6281234567890 (format wa.me) */
export function toInternationalPhone(value: string): string {
  const digits = normalizePhone(value);
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}
