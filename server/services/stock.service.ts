import "server-only";
import { StockMovementType } from "@/constants/stock-movement";
import { auditCreate, auditUpdate, notDeleted } from "../audit";
import type { Tx } from "../db";
import { conflict, notFound } from "../http/errors";

interface StockChange {
  sparepartId: string;
  qty: number;
  userId: string;
  orderId?: string | null;
  note?: string | null;
}

/**
 * Potong stok secara atomik (Spesifikasi §4):
 * UPDATE spare_parts SET stock = stock - qty WHERE id = ? AND stock >= qty
 * Jika tidak ada baris ter-update → stok kurang → transaksi dibatalkan.
 */
export async function takeStock(tx: Tx, { sparepartId, qty, userId, orderId, note }: StockChange) {
  if (qty <= 0) return;
  const { count } = await tx.sparePart.updateMany({
    where: { id: sparepartId, ...notDeleted, stock: { gte: qty } },
    data: { stock: { decrement: qty }, ...auditUpdate(userId) },
  });
  if (count === 0) {
    const part = await tx.sparePart.findUnique({ where: { id: sparepartId }, select: { name: true, stock: true } });
    if (!part) throw notFound("Sparepart");
    throw conflict(`Stok ${part.name} tidak cukup (tersedia ${part.stock}, dibutuhkan ${qty})`);
  }
  await recordMovement(tx, StockMovementType.out, -qty, { sparepartId, qty, userId, orderId, note });
}

/** Kembalikan stok ke gudang (order batal / item dihapus / qty dikurangi). */
export async function returnStock(tx: Tx, { sparepartId, qty, userId, orderId, note }: StockChange) {
  if (qty <= 0) return;
  await tx.sparePart.update({
    where: { id: sparepartId },
    data: { stock: { increment: qty }, ...auditUpdate(userId) },
  });
  await recordMovement(tx, StockMovementType.return, qty, { sparepartId, qty, userId, orderId, note });
}

/** Barang masuk dari supplier. */
export async function addStock(tx: Tx, change: StockChange) {
  await tx.sparePart.update({
    where: { id: change.sparepartId },
    data: { stock: { increment: change.qty }, ...auditUpdate(change.userId) },
  });
  await recordMovement(tx, StockMovementType.in, change.qty, change);
}

/** Stock opname: set stok ke jumlah fisik, selisihnya dicatat. */
export async function adjustStock(tx: Tx, { sparepartId, qty: actualStock, userId, note }: StockChange) {
  const part = await tx.sparePart.findFirst({ where: { id: sparepartId, ...notDeleted }, select: { stock: true } });
  if (!part) throw notFound("Sparepart");
  const delta = actualStock - part.stock;
  if (delta === 0) return;
  await tx.sparePart.update({ where: { id: sparepartId }, data: { stock: actualStock, ...auditUpdate(userId) } });
  await recordMovement(tx, StockMovementType.adjust, delta, { sparepartId, qty: delta, userId, note });
}

/** Ubah stok sebesar selisih qty (positif = ambil lagi, negatif = kembalikan). */
export async function applyStockDelta(tx: Tx, change: StockChange) {
  if (change.qty > 0) return takeStock(tx, change);
  if (change.qty < 0) return returnStock(tx, { ...change, qty: -change.qty });
}

function recordMovement(tx: Tx, type: StockMovementType, signedQty: number, change: StockChange) {
  return tx.stockMovement.create({
    data: {
      sparepartId: change.sparepartId,
      type,
      qty: signedQty,
      orderId: change.orderId ?? null,
      note: change.note ?? null,
      ...auditCreate(change.userId),
    },
  });
}
