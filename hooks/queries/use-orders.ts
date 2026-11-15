"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { queryKeys } from "@/constants/query-keys";
import { AppRoute } from "@/constants/routes";
import type {
  OrderInput,
  OrderStatusChangeInput,
  PaymentInput,
  ServiceFeeInput,
} from "@/schemas/order.schema";
import { orderService } from "@/services/order.service";
import type { OrderDetail, OrderListParams } from "@/types/order";
import { buildUrl } from "@/utils/url";
import { useAppMutation } from "../use-app-mutation";

/** Perubahan order bisa mengubah stok sparepart → keduanya di-refresh. */
const invalidate = [queryKeys.orders.all, queryKeys.spareParts.all, queryKeys.dashboard.all, queryKeys.reports.all];

export function useOrders(params: OrderListParams) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => orderService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: queryKeys.orders.detail(id), queryFn: () => orderService.get(id) });
}

export function useCreateOrder() {
  const router = useRouter();
  return useAppMutation({
    mutationFn: orderService.create,
    invalidate,
    onSuccess: (order) => router.push(buildUrl(AppRoute.OrderDetail, { id: order.id })),
  });
}

/** Mutation untuk satu order yang mengembalikan OrderDetail terbaru. */
function useOrderMutation<TVars>(mutationFn: (vars: TVars) => Promise<OrderDetail>, onSuccess?: () => void) {
  return useAppMutation({ mutationFn, invalidate, onSuccess });
}

export const useUpdateOrder = (id: string, onSuccess?: () => void) =>
  useOrderMutation((input: OrderInput) => orderService.update(id, input), onSuccess);

export const useChangeOrderStatus = (id: string, onSuccess?: () => void) =>
  useOrderMutation((input: OrderStatusChangeInput) => orderService.changeStatus(id, input), onSuccess);

export const usePayOrder = (id: string, onSuccess?: () => void) =>
  useOrderMutation((input: PaymentInput) => orderService.pay(id, input), onSuccess);

export const useSaveOrderItem = (id: string, itemId?: string, onSuccess?: () => void) =>
  useOrderMutation(
    (input: ServiceFeeInput) => (itemId ? orderService.updateItem(id, itemId, input) : orderService.addItem(id, input)),
    onSuccess,
  );

export const useRemoveOrderItem = (id: string) =>
  useOrderMutation((itemId: string) => orderService.removeItem(id, itemId));
