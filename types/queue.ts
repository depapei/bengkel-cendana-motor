import type { OrderStatus } from "@/constants/order-status";
import type { Paginated } from "./common";
import type { Brand, Customer, Mechanic, SparePart, Vehicle } from "./models";
import type { Order } from "./order";

/**
 * Order versi publik (papan antrean customer).
 * Sengaja TIDAK memuat data sensitif: harga, total, pembayaran, nomor HP, catatan internal.
 */
export interface QueueOrder
  extends Pick<Order, "id" | "orderNo" | "status" | "complaint" | "createdAt" | "draftAt" | "bookedAt" | "progressAt" | "doneAt" | "cancelledAt"> {
  customer: Pick<Customer, "name">;
  customerVehicle: Pick<Vehicle, "platNomor"> & { brand: Pick<Brand, "name" | "type"> };
  mechanic: Pick<Mechanic, "name"> | null;
}

/** Item pengerjaan tanpa harga. */
export interface QueueItem {
  id: string;
  name: string;
  qty: number;
  sparePart: Pick<SparePart, "name"> | null;
}

export interface QueueOrderDetail extends QueueOrder, Pick<Order, "mileage" | "nextServiceDate" | "nextServiceNote"> {
  serviceFees: QueueItem[];
}

export interface QueuePage extends Paginated<QueueOrder> {
  /** Awal hari antrean (WIB) menurut server. */
  date: string;
  /** Jumlah order hari ini per status (tidak terpengaruh pencarian). */
  statusCounts: Record<OrderStatus, number>;
}
