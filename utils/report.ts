import type { ExportFormat, ReportKind } from "@/constants/report";
import { toAppTime } from "./format";

const FILE_DATE_FORMAT = "YYYYMMDD";

/** Nama file export, sama di server (Content-Disposition) & client (unduhan). */
export function reportFileName(kind: ReportKind, from: string | Date, to: string | Date, format: ExportFormat): string {
  const day = (value: string | Date) => toAppTime(value).format(FILE_DATE_FORMAT);
  return `laporan-${kind}_${day(from)}-${day(to)}.${format}`;
}
