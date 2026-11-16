import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { StockMovementType, STOCK_NOTE } from "@/constants/stock-movement";
import type { ListQuery } from "@/schemas/list.schema";
import type { SparePartCreateData, SparePartData, StockMovementData } from "@/schemas/spare-part.schema";
import { auditCreate, auditDelete, auditUpdate, notDeleted } from "../audit";
import { db, type Tx } from "../db";
import { notFound } from "../http/errors";
import { toPaginated, toSkipTake } from "../pagination";
import { recalcOrderTotals } from "./order.service";
import { addStock, adjustStock } from "./stock.service";

const ENTITY = "Sparepart";

export async function listSpareParts(query: ListQuery) {
  const where: Prisma.SparePartWhereInput = {
    ...notDeleted,
    ...(query.q && { name: { contains: query.q, mode: "insensitive" } }),
  };
  const [items, total] = await db.$transaction([
    db.sparePart.findMany({ where, orderBy: { name: "asc" }, ...toSkipTake(query) }),
    db.sparePart.count({ where }),
  ]);
  return toPaginated(query, items, total);
}

export async function getSparePart(id: string) {
  const part = await db.sparePart.findFirst({ where: { id, ...notDeleted } });
  if (!part) throw notFound(ENTITY);
  return part;
}

export async function createSparePart({ stock, ...data }: SparePartCreateData, userId: string) {
  return db.$transaction(async (tx) => {
    const part = await tx.sparePart.create({ data: { ...data, stock: 0, ...auditCreate(userId) } });
    if (stock > 0) await addStock(tx, { sparepartId: part.id, qty: stock, userId, note: STOCK_NOTE.initial });
    return tx.sparePart.findUniqueOrThrow({ where: { id: part.id } });
  });
}

/**
 * Item order lama yang modalnya belum diketahui (dibuat sebelum harga beli diisi) memakai harga beli
 * ini, lalu modal & laba order terkait dihitung ulang. Snapshot yang sudah ada tidak diubah.
 */
async function backfillItemCost(tx: Tx, sparepartId: string, purchasePrice: number, userId: string) {
  const where = { sparepartId, sparepartCost: null, ...notDeleted };
  const orders = await tx.serviceFee.findMany({ where, select: { orderId: true }, distinct: ["orderId"] });
  if (orders.length === 0) return;
  await tx.serviceFee.updateMany({ where, data: { sparepartCost: purchasePrice, ...auditUpdate(userId) } });
  await recalcOrderTotals(tx, orders.map((order) => order.orderId), userId);
}

/** Stok tidak diubah di sini — wajib lewat pergerakan stok agar tercatat. */
export async function updateSparePart(id: string, data: SparePartData, userId: string) {
  await getSparePart(id);
  return db.$transaction(async (tx) => {
    const part = await tx.sparePart.update({ where: { id }, data: { ...data, ...auditUpdate(userId) } });
    await backfillItemCost(tx, id, data.purchasePrice, userId);
    return part;
  });
}

export async function deleteSparePart(id: string, userId: string) {
  await getSparePart(id);
  await db.sparePart.update({ where: { id }, data: auditDelete(userId) });
}

export async function listStockMovements(sparepartId: string, query: ListQuery) {
  const where: Prisma.StockMovementWhereInput = { sparepartId, ...notDeleted };
  const [items, total] = await db.$transaction([
    db.stockMovement.findMany({
      where,
      include: { order: { select: { id: true, orderNo: true } } },
      orderBy: { createdAt: "desc" },
      ...toSkipTake(query),
    }),
    db.stockMovement.count({ where }),
  ]);
  return toPaginated(query, items, total);
}

export async function createStockMovement(sparepartId: string, data: StockMovementData, userId: string) {
  await getSparePart(sparepartId);
  return db.$transaction(async (tx) => {
    const change = { sparepartId, qty: data.qty, note: data.note, userId };
    if (data.type === StockMovementType.in) await addStock(tx, change);
    else await adjustStock(tx, change);
    return tx.sparePart.findUniqueOrThrow({ where: { id: sparepartId } });
  });
}
