import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { ListQuery } from "@/schemas/list.schema";
import { todayRange } from "@/utils/format";
import { normalizePlat } from "@/utils/normalize";
import { toStatusCounts } from "@/utils/order";
import { notDeleted } from "../audit";
import { db } from "../db";
import { notFound } from "../http/errors";
import { toPaginated, toSkipTake } from "../pagination";

/**
 * Papan antrean publik. Pakai `select` (bukan `include`) supaya hanya kolom aman
 * yang keluar — harga, total, pembayaran, nomor HP & catatan internal tidak pernah dikirim.
 */
const QUEUE_SELECT = {
  id: true,
  orderNo: true,
  status: true,
  complaint: true,
  createdAt: true,
  draftAt: true,
  bookedAt: true,
  progressAt: true,
  doneAt: true,
  cancelledAt: true,
  customer: { select: { name: true } },
  customerVehicle: { select: { platNomor: true, brand: { select: { name: true, type: true } } } },
  mechanic: { select: { name: true } },
} satisfies Prisma.OrderSelect;

const QUEUE_DETAIL_SELECT = {
  ...QUEUE_SELECT,
  mileage: true,
  nextServiceDate: true,
  nextServiceNote: true,
  serviceFees: {
    where: notDeleted,
    select: { id: true, name: true, qty: true, sparePart: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.OrderSelect;

/** Hanya order yang masuk hari ini (WIB). */
function todayWhere({ from, to } = todayRange()): Prisma.OrderWhereInput {
  return { ...notDeleted, createdAt: { gte: from, lte: to } };
}

function searchWhere(q?: string): Prisma.OrderWhereInput {
  if (!q) return {};
  const text = { contains: q, mode: "insensitive" } as const;
  return {
    OR: [
      { orderNo: text },
      { customer: { name: text } },
      { customerVehicle: { platNomor: { contains: normalizePlat(q) } } },
      { customerVehicle: { brand: { name: text } } },
      { customerVehicle: { brand: { type: text } } },
    ],
  };
}

export async function listQueue(query: ListQuery) {
  const range = todayRange();
  const today = todayWhere(range);
  const where = { AND: [today, searchWhere(query.q)] };
  const [items, total, statusGroups] = await Promise.all([
    // Urut nomor order = urutan masuk antrean.
    db.order.findMany({ where, select: QUEUE_SELECT, orderBy: { orderNo: "asc" }, ...toSkipTake(query) }),
    db.order.count({ where }),
    db.order.groupBy({ by: ["status"], where: today, _count: { _all: true } }),
  ]);
  return { ...toPaginated(query, items, total), date: range.from, statusCounts: toStatusCounts(statusGroups) };
}

export async function getQueueOrder(id: string) {
  const order = await db.order.findFirst({ where: { AND: [todayWhere(), { id }] }, select: QUEUE_DETAIL_SELECT });
  if (!order) throw notFound("Order");
  return order;
}
