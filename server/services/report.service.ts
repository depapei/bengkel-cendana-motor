import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { MESSAGE } from "@/constants/messages";
import { PaymentStatus } from "@/constants/payment";
import { EXPORT_MAX_ROWS } from "@/constants/report";
import type {
  OrderReportFilter,
  OrderReportQuery,
  StockReportFilter,
  StockReportQuery,
} from "@/schemas/report.schema";
import type { OrderReportSummary, StockReportSummary } from "@/types/report";
import { notDeleted } from "../audit";
import { db } from "../db";
import { badRequest } from "../http/errors";
import { toReportPage, toSkipTake } from "../pagination";

/** Hanya kolom yang ditampilkan di laporan (lihat types/report.ts). */
const REPORT_ORDER_SELECT = {
  id: true,
  orderNo: true,
  createdAt: true,
  status: true,
  paymentStatus: true,
  totalPrice: true,
  customer: { select: { name: true } },
  customerVehicle: { select: { platNomor: true } },
} satisfies Prisma.OrderSelect;

const REPORT_MOVEMENT_SELECT = {
  id: true,
  createdAt: true,
  type: true,
  qty: true,
  note: true,
  sparePart: { select: { id: true, name: true } },
  order: { select: { id: true, orderNo: true } },
} satisfies Prisma.StockMovementSelect;

const ORDER_BY_NEWEST = { createdAt: "desc" } as const;

/** Filter `IN (...)`; daftar kosong = tanpa filter. */
const inList = <T>(values?: T[]) => (values?.length ? { in: values } : undefined);

function orderWhere(filter: OrderReportFilter): Prisma.OrderWhereInput {
  return {
    ...notDeleted,
    createdAt: { gte: filter.from, lte: filter.to },
    status: inList(filter.status),
    paymentStatus: inList(filter.paymentStatus),
  };
}

function stockWhere(filter: StockReportFilter): Prisma.StockMovementWhereInput {
  return { ...notDeleted, createdAt: { gte: filter.from, lte: filter.to }, type: inList(filter.type) };
}

/** Query ringkasan order (dipakai di transaksi list & export). */
const orderSummaryQueries = (where: Prisma.OrderWhereInput) =>
  [
    db.order.aggregate({ where, _sum: { totalPrice: true } }),
    db.order.aggregate({ where: { AND: [where, { paymentStatus: PaymentStatus.paid }] }, _sum: { totalPrice: true } }),
  ] as const;

const toOrderSummary = (
  sum: { _sum: { totalPrice: number | null } },
  paid: { _sum: { totalPrice: number | null } },
): OrderReportSummary => ({ totalPrice: sum._sum.totalPrice ?? 0, paidTotal: paid._sum.totalPrice ?? 0 });

const stockSummaryQueries = (where: Prisma.StockMovementWhereInput) =>
  [
    db.stockMovement.aggregate({ where: { AND: [where, { qty: { gt: 0 } }] }, _sum: { qty: true } }),
    db.stockMovement.aggregate({ where: { AND: [where, { qty: { lt: 0 } }] }, _sum: { qty: true } }),
  ] as const;

const toStockSummary = (
  incoming: { _sum: { qty: number | null } },
  outgoing: { _sum: { qty: number | null } },
): StockReportSummary => ({ qtyIn: incoming._sum.qty ?? 0, qtyOut: Math.abs(outgoing._sum.qty ?? 0) });

function assertExportable(total: number) {
  if (total > EXPORT_MAX_ROWS) throw badRequest(MESSAGE.exportTooLarge(EXPORT_MAX_ROWS));
}

// ---------------------------------------------------------------- list (paginated)

export async function getOrderReport(query: OrderReportQuery) {
  const where = orderWhere(query);
  const [items, total, sum, paid] = await db.$transaction([
    db.order.findMany({ where, select: REPORT_ORDER_SELECT, orderBy: ORDER_BY_NEWEST, ...toSkipTake(query) }),
    db.order.count({ where }),
    ...orderSummaryQueries(where),
  ]);
  return toReportPage(items, total, toOrderSummary(sum, paid));
}

export async function getStockReport(query: StockReportQuery) {
  const where = stockWhere(query);
  const [items, total, incoming, outgoing] = await db.$transaction([
    db.stockMovement.findMany({ where, select: REPORT_MOVEMENT_SELECT, orderBy: ORDER_BY_NEWEST, ...toSkipTake(query) }),
    db.stockMovement.count({ where }),
    ...stockSummaryQueries(where),
  ]);
  return toReportPage(items, total, toStockSummary(incoming, outgoing));
}

// ---------------------------------------------------------------- export (semua baris)

export async function getOrderReportRows(filter: OrderReportFilter) {
  const where = orderWhere(filter);
  assertExportable(await db.order.count({ where }));
  const [items, sum, paid] = await db.$transaction([
    db.order.findMany({ where, select: REPORT_ORDER_SELECT, orderBy: ORDER_BY_NEWEST }),
    ...orderSummaryQueries(where),
  ]);
  return { items, summary: toOrderSummary(sum, paid) };
}

export async function getStockReportRows(filter: StockReportFilter) {
  const where = stockWhere(filter);
  assertExportable(await db.stockMovement.count({ where }));
  const [items, incoming, outgoing] = await db.$transaction([
    db.stockMovement.findMany({ where, select: REPORT_MOVEMENT_SELECT, orderBy: ORDER_BY_NEWEST }),
    ...stockSummaryQueries(where),
  ]);
  return { items, summary: toStockSummary(incoming, outgoing) };
}
