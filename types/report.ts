import type { OrderStatus } from "@/constants/order-status";
import type { PaymentStatus } from "@/constants/payment";
import type { StockMovementType } from "@/constants/stock-movement";
import type { ListParams } from "./common";

/** Halaman laporan: baris + total baris + ringkasan seluruh periode. */
export interface ReportPage<T, S> {
  items: T[];
  total: number;
  summary: S;
}

export interface DateRange {
  /** ISO string (awal hari). */
  from: string;
  /** ISO string (akhir hari). */
  to: string;
}

export interface OrderReportParams extends ListParams, DateRange {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
}

export interface StockReportParams extends ListParams, DateRange {
  type?: StockMovementType[];
}

/** Filter laporan tanpa paging (dipakai export). */
export type OrderReportFilter = Omit<OrderReportParams, keyof ListParams>;
export type StockReportFilter = Omit<StockReportParams, keyof ListParams>;

export interface ReportOrder {
  id: string;
  orderNo: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  customer: { name: string };
  customerVehicle: { platNomor: string };
}

export interface OrderReportSummary {
  totalPrice: number;
  paidTotal: number;
}

export interface ReportStockMovement {
  id: string;
  createdAt: string;
  type: StockMovementType;
  qty: number;
  note: string | null;
  sparePart: { id: string; name: string };
  order: { id: string; orderNo: string } | null;
}

export interface StockReportSummary {
  qtyIn: number;
  qtyOut: number;
}

export interface LowStockPart {
  id: string;
  name: string;
  stock: number;
}

export interface DashboardSummary {
  orderStatusCounts: Record<OrderStatus, number>;
  lowStockParts: LowStockPart[];
  lowStockTotal: number;
}
