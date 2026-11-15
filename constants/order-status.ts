import { OrderStatus } from "@/generated/prisma/enums";
import type { EnumMeta } from "@/types/common";

/** Sumber tunggal: enum `OrderStatus` di prisma/schema.prisma. */
export { OrderStatus };

export const ORDER_STATUS_META: EnumMeta<OrderStatus> = {
  [OrderStatus.draft]: { label: "Draft", color: "default" },
  [OrderStatus.booked]: { label: "Booked", color: "blue" },
  [OrderStatus.in_progress]: { label: "Dikerjakan", color: "orange" },
  [OrderStatus.done]: { label: "Selesai", color: "green" },
  [OrderStatus.cancelled]: { label: "Dibatalkan", color: "red" },
};

/** Aturan transisi (Spesifikasi §3). Status tidak bisa mundur. */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.draft]: [OrderStatus.booked, OrderStatus.cancelled],
  [OrderStatus.booked]: [OrderStatus.in_progress, OrderStatus.cancelled],
  [OrderStatus.in_progress]: [OrderStatus.done, OrderStatus.cancelled],
  [OrderStatus.done]: [],
  [OrderStatus.cancelled]: [],
};

/** Label tombol aksi untuk pindah ke status tujuan. */
export const ORDER_STATUS_ACTION_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.draft]: "Jadikan Draft",
  [OrderStatus.booked]: "Customer Setuju (Booked)",
  [OrderStatus.in_progress]: "Mulai Kerjakan",
  [OrderStatus.done]: "Selesai",
  [OrderStatus.cancelled]: "Batalkan Order",
};

/** Status saat stok sparepart sudah dipotong. */
export const STOCK_COMMITTED_STATUSES: readonly OrderStatus[] = [
  OrderStatus.booked,
  OrderStatus.in_progress,
];

/** Status saat item order masih boleh ditambah/ubah/hapus. */
export const ITEM_EDITABLE_STATUSES: readonly OrderStatus[] = [
  OrderStatus.draft,
  OrderStatus.booked,
  OrderStatus.in_progress,
];

/** Kolom timestamp yang diisi saat order masuk ke status tsb. */
export const ORDER_STATUS_TIMESTAMP_FIELD = {
  [OrderStatus.draft]: "draftAt",
  [OrderStatus.booked]: "bookedAt",
  [OrderStatus.in_progress]: "progressAt",
  [OrderStatus.done]: "doneAt",
  [OrderStatus.cancelled]: "cancelledAt",
} as const satisfies Record<OrderStatus, string>;

/** Draft lebih lama dari ini otomatis dibatalkan (asumsi Spesifikasi §8). */
export const DRAFT_EXPIRY_DAYS = 7;
export const DRAFT_EXPIRY_REASON = `Otomatis: draft lebih dari ${DRAFT_EXPIRY_DAYS} hari`;

/** Prefix nomor order, contoh CM-20261106-001. */
export const ORDER_NO_PREFIX = "CM";
