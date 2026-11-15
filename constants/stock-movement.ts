import { StockMovementType } from "@/generated/prisma/enums";
import type { EnumMeta } from "@/types/common";

export { StockMovementType };

export const STOCK_MOVEMENT_TYPE_META: EnumMeta<StockMovementType> = {
  [StockMovementType.in]: { label: "Barang Masuk", color: "green" },
  [StockMovementType.out]: { label: "Keluar (Order)", color: "red" },
  [StockMovementType.return]: { label: "Kembali (Order)", color: "blue" },
  [StockMovementType.adjust]: { label: "Penyesuaian", color: "purple" },
};

/** Jenis pergerakan yang boleh diinput manual dari halaman sparepart. */
export const MANUAL_STOCK_MOVEMENT_TYPES = [
  StockMovementType.in,
  StockMovementType.adjust,
] as const;

export const STOCK_NOTE = {
  initial: "Stok awal",
  booked: (orderNo: string) => `Order ${orderNo} booked`,
  itemAdded: (orderNo: string) => `Item ditambah ke order ${orderNo}`,
  itemChanged: (orderNo: string) => `Item diubah di order ${orderNo}`,
  itemRemoved: (orderNo: string) => `Item dihapus dari order ${orderNo}`,
  cancelled: (orderNo: string) => `Order ${orderNo} dibatalkan`,
} as const;
