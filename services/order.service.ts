import { ApiEndpoint } from "@/constants/api-endpoints";
import { api } from "@/lib/axios";
import type {
  OrderCreateInput,
  OrderInput,
  OrderStatusChangeInput,
  PaymentInput,
  ServiceFeeInput,
} from "@/schemas/order.schema";
import type { Paginated } from "@/types/common";
import type { Order, OrderDetail, OrderListParams } from "@/types/order";
import { buildUrl } from "@/utils/url";

const detailUrl = (endpoint: ApiEndpoint, id: string, itemId?: string) =>
  buildUrl(endpoint, itemId ? { id, itemId } : { id });

export const orderService = {
  list: (params?: OrderListParams) => api.get<Paginated<Order>>(ApiEndpoint.Orders, { params }).then((res) => res.data),
  get: (id: string) => api.get<OrderDetail>(detailUrl(ApiEndpoint.OrderDetail, id)).then((res) => res.data),
  create: (input: OrderCreateInput) => api.post<OrderDetail>(ApiEndpoint.Orders, input).then((res) => res.data),
  update: (id: string, input: OrderInput) =>
    api.patch<OrderDetail>(detailUrl(ApiEndpoint.OrderDetail, id), input).then((res) => res.data),
  changeStatus: (id: string, input: OrderStatusChangeInput) =>
    api.post<OrderDetail>(detailUrl(ApiEndpoint.OrderStatus, id), input).then((res) => res.data),
  pay: (id: string, input: PaymentInput) =>
    api.post<OrderDetail>(detailUrl(ApiEndpoint.OrderPayment, id), input).then((res) => res.data),
  addItem: (id: string, input: ServiceFeeInput) =>
    api.post<OrderDetail>(detailUrl(ApiEndpoint.OrderItems, id), input).then((res) => res.data),
  updateItem: (id: string, itemId: string, input: ServiceFeeInput) =>
    api.patch<OrderDetail>(detailUrl(ApiEndpoint.OrderItemDetail, id, itemId), input).then((res) => res.data),
  removeItem: (id: string, itemId: string) =>
    api.delete<OrderDetail>(detailUrl(ApiEndpoint.OrderItemDetail, id, itemId)).then((res) => res.data),
};
