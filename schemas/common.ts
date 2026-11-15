import { z } from "zod";
import { MESSAGE } from "@/constants/messages";
import { normalizePhone, normalizePlat, normalizeUpper } from "@/utils/normalize";

/** Aturan validasi yang dipakai ulang di banyak form & API. */
export const requiredString = (label: string) =>
  z.string({ error: MESSAGE.required(label) }).trim().min(1, MESSAGE.required(label));

/** Wajib isi + disimpan KAPITAL, supaya "Honda" & "honda" tidak jadi data berbeda. */
export const upperString = (label: string) => requiredString(label).transform(normalizeUpper);

export const optionalString = () =>
  z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || null);

export const phoneNumber = () =>
  requiredString("Nomor HP")
    .transform(normalizePhone)
    .refine((value) => /^08\d{7,12}$/.test(value), "Nomor HP tidak valid (contoh: 0812xxxxxxx)");

export const platNomor = () =>
  requiredString("Plat nomor")
    .transform(normalizePlat)
    .refine((value) => /^[A-Z]{1,2} \d{1,4}( [A-Z]{1,3})?$/.test(value), "Plat nomor tidak valid (contoh: B 1234 ABC)");

export const money = (label: string) =>
  z.number({ error: MESSAGE.required(label) }).int().min(0, `${label} tidak boleh negatif`);

export const positiveInt = (label: string) =>
  z.number({ error: MESSAGE.required(label) }).int().min(1, `${label} minimal 1`);

/** Daftar enum dalam satu query param CSV (`a,b`). Kosong = tanpa filter. */
export const csvEnum = <T extends Record<string, string>>(values: T) =>
  z
    .string()
    .optional()
    .transform((value) => (value ? value.split(",").filter(Boolean) : undefined))
    .pipe(z.array(z.enum(values)).optional());

export const idSchema = (label: string) => requiredString(label);
