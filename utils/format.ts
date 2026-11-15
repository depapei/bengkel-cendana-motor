import dayjs from "dayjs";
import "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { APP_LOCALE, APP_TIMEZONE, CURRENCY, DATE_FORMAT, DATE_ONLY_FORMAT, DATE_TIME_FORMAT, MILEAGE_UNIT } from "@/constants/app";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

/** Waktu dalam zona aplikasi (WIB), sama di server & browser. */
export const toAppTime = (value: string | Date) => dayjs(value).tz(APP_TIMEZONE);

const rupiah = new Intl.NumberFormat(APP_LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number | null | undefined): string {
  return rupiah.format(value ?? 0);
}

/** Awal & akhir hari ini dalam zona aplikasi (WIB). */
export function todayRange(now: Date = new Date()): { from: Date; to: Date } {
  const day = toAppTime(now);
  return { from: day.startOf("day").toDate(), to: day.endOf("day").toDate() };
}

export function formatDate(value: string | Date | null | undefined): string {
  return value ? toAppTime(value).format(DATE_FORMAT) : "-";
}

export function formatDateTime(value: string | Date | null | undefined): string {
  return value ? toAppTime(value).format(DATE_TIME_FORMAT) : "-";
}

const number = new Intl.NumberFormat(APP_LOCALE);

export function formatMileage(value: number | null | undefined): string {
  return value == null ? "-" : `${number.format(value)} ${MILEAGE_UNIT}`;
}

/**
 * Kolom @db.Date dikirim API sebagai tengah malam UTC ("2026-12-01T00:00:00.000Z").
 * Ambil bagian tanggalnya saja supaya tidak bergeser karena zona waktu.
 */
export const toDateOnly = (value: string | null | undefined): string | null => (value ? value.slice(0, DATE_ONLY_FORMAT.length) : null);

export function formatDateOnly(value: string | null | undefined): string {
  const date = toDateOnly(value);
  return date ? dayjs(date).format(DATE_FORMAT) : "-";
}

/** Pemisah ribuan untuk InputNumber AntD. */
export const numberInputFormatter = (value: number | string | undefined) =>
  `${value ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const numberInputParser = (value: string | undefined) =>
  Number((value ?? "").replace(/\D/g, ""));
