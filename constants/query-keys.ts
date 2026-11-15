import type { ListParams } from "@/types/common";
import type { OrderListParams } from "@/types/order";
import type { OrderReportParams, StockReportParams } from "@/types/report";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  customers: {
    all: ["customers"] as const,
    list: (params?: ListParams) => [...queryKeys.customers.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.customers.all, "detail", id] as const,
  },
  brands: {
    all: ["brands"] as const,
  },
  mechanics: {
    all: ["mechanics"] as const,
  },
  spareParts: {
    all: ["spare-parts"] as const,
    list: (params?: ListParams) => [...queryKeys.spareParts.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.spareParts.all, "detail", id] as const,
    movements: (id: string, params?: ListParams) =>
      [...queryKeys.spareParts.all, "movements", id, params] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params?: OrderListParams) => [...queryKeys.orders.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
  },
  reports: {
    all: ["reports"] as const,
    orders: (params: OrderReportParams) => [...queryKeys.reports.all, "orders", params] as const,
    stockMovements: (params: StockReportParams) => [...queryKeys.reports.all, "stock-movements", params] as const,
  },
  users: {
    all: ["users"] as const,
  },
};
