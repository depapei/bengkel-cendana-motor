import type { ListQuery } from "@/schemas/list.schema";
import type { Paginated } from "@/types/common";
import type { ReportPage } from "@/types/report";

export function toSkipTake({ page, pageSize }: ListQuery) {
  return { skip: (page - 1) * pageSize, take: pageSize };
}

export function toPaginated<T>(query: ListQuery, items: T[], total: number): Paginated<T> {
  return { items, total, page: query.page, pageSize: query.pageSize };
}

/** Halaman laporan: hanya field yang dipakai UI + ringkasan seluruh periode. */
export function toReportPage<T, S>(items: T[], total: number, summary: S): ReportPage<T, S> {
  return { items, total, summary };
}
