import dayjs from "dayjs";
import "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { APP_LOCALE, APP_TIMEZONE, CURRENCY, DATE_FORMAT, DATE_TIME_FORMAT } from "@/constants/app";

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

export function formatDate(value: string | Date | null | undefined): string {
  return value ? toAppTime(value).format(DATE_FORMAT) : "-";
}

export function formatDateTime(value: string | Date | null | undefined): string {
  return value ? toAppTime(value).format(DATE_TIME_FORMAT) : "-";
}

/** Pemisah ribuan untuk InputNumber AntD. */
export const numberInputFormatter = (value: number | string | undefined) =>
  `${value ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const numberInputParser = (value: string | undefined) =>
  Number((value ?? "").replace(/\D/g, ""));
