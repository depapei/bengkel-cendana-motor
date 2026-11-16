import "server-only";
import { ORDER_STATUS_META } from "@/constants/order-status";
import { PAYMENT_STATUS_META } from "@/constants/payment";
import { MESSAGE } from "@/constants/messages";
import { EXPORT_FORMAT_META, ExportFormat, REPORT_TITLE, ReportKind } from "@/constants/report";
import { STOCK_MOVEMENT_TYPE_META } from "@/constants/stock-movement";
import type { OrderExportQuery, StockExportQuery } from "@/schemas/report.schema";
import type { EnumMeta } from "@/types/common";
import { formatDate, formatDateTime, formatRupiah } from "@/utils/format";
import { calcProfit } from "@/utils/order";
import { reportFileName } from "@/utils/report";
import { buildPdf } from "../export/pdf";
import type { ExportColumn, ExportDocument } from "../export/types";
import { buildXlsx } from "../export/xlsx";
import { getOrderReportRows, getStockReportRows } from "./report.service";

type Row<F extends (...args: never[]) => Promise<{ items: unknown[] }>> = Awaited<ReturnType<F>>["items"][number];
type OrderRow = Row<typeof getOrderReportRows>;
type MovementRow = Row<typeof getStockReportRows>;

const ALL_LABEL = "Semua";
/** Modal / laba yang belum bisa dihitung. */
const EMPTY_CELL = "-";

const ORDER_COLUMNS: ExportColumn<OrderRow>[] = [
  { header: "No. Order", width: 20, value: (row) => row.orderNo },
  { header: "Tanggal", width: 18, value: (row) => formatDateTime(row.createdAt) },
  { header: "Customer", width: 24, value: (row) => row.customer.name },
  { header: "Plat Nomor", width: 14, value: (row) => row.customerVehicle.platNomor },
  { header: "Status", width: 12, value: (row) => ORDER_STATUS_META[row.status].label },
  { header: "Pembayaran", width: 12, value: (row) => PAYMENT_STATUS_META[row.paymentStatus].label },
  { header: "Total", width: 16, value: (row) => row.totalPrice, money: true, align: "right" },
  { header: "Modal", width: 16, value: (row) => row.totalCost ?? EMPTY_CELL, money: true, align: "right" },
  { header: "Laba", width: 16, value: (row) => calcProfit(row.totalPrice, row.totalCost) ?? EMPTY_CELL, money: true, align: "right" },
];

const MOVEMENT_COLUMNS: ExportColumn<MovementRow>[] = [
  { header: "Waktu", width: 18, value: (row) => formatDateTime(row.createdAt) },
  { header: "Sparepart", width: 28, value: (row) => row.sparePart.name },
  { header: "Jenis", width: 16, value: (row) => STOCK_MOVEMENT_TYPE_META[row.type].label },
  { header: "Qty", width: 8, value: (row) => row.qty, align: "right" },
  { header: "Order", width: 20, value: (row) => row.order?.orderNo ?? "-" },
  { header: "Catatan", width: 32, value: (row) => row.note ?? "-" },
];

const periodLine = (from: Date, to: Date) => `Periode: ${formatDate(from)} - ${formatDate(to)}`;

const filterLine = <T extends string>(label: string, meta: EnumMeta<T>, values?: T[]) =>
  `${label}: ${values?.length ? values.map((value) => meta[value].label).join(", ") : ALL_LABEL}`;

async function toFileResponse<T>(doc: ExportDocument<T>, format: ExportFormat, fileName: string) {
  const body = format === ExportFormat.Pdf ? await buildPdf(doc) : await buildXlsx(doc);
  return new Response(body as BodyInit, {
    headers: {
      "Content-Type": EXPORT_FORMAT_META[format].mime,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function exportOrderReport({ format, ...filter }: OrderExportQuery) {
  const { items, summary } = await getOrderReportRows(filter);
  return toFileResponse(
    {
      title: REPORT_TITLE[ReportKind.Orders],
      subtitles: [
        periodLine(filter.from, filter.to),
        filterLine("Status order", ORDER_STATUS_META, filter.status),
        filterLine("Pembayaran", PAYMENT_STATUS_META, filter.paymentStatus),
      ],
      summary: [
        { label: "Jumlah order", value: String(items.length) },
        { label: "Total nilai order", value: formatRupiah(summary.totalPrice) },
        { label: "Total lunas", value: formatRupiah(summary.paidTotal) },
        { label: "Modal sparepart (lunas)", value: formatRupiah(summary.paidCost) },
        { label: "Laba kotor (lunas)", value: formatRupiah(summary.paidProfit) },
        ...(summary.unknownCostCount > 0 ? [{ label: "Catatan", value: MESSAGE.unknownCostOrders(summary.unknownCostCount) }] : []),
      ],
      columns: ORDER_COLUMNS,
      rows: items,
    },
    format,
    reportFileName(ReportKind.Orders, filter.from, filter.to, format),
  );
}

export async function exportStockReport({ format, ...filter }: StockExportQuery) {
  const { items, summary } = await getStockReportRows(filter);
  return toFileResponse(
    {
      title: REPORT_TITLE[ReportKind.StockMovements],
      subtitles: [periodLine(filter.from, filter.to), filterLine("Jenis", STOCK_MOVEMENT_TYPE_META, filter.type)],
      summary: [
        { label: "Jumlah pergerakan", value: String(items.length) },
        { label: "Qty masuk", value: String(summary.qtyIn) },
        { label: "Qty keluar", value: String(summary.qtyOut) },
      ],
      columns: MOVEMENT_COLUMNS,
      rows: items,
    },
    format,
    reportFileName(ReportKind.StockMovements, filter.from, filter.to, format),
  );
}
