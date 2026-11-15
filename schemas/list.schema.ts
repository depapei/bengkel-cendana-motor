import { z } from "zod";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/constants/app";
import { OrderStatus } from "@/constants/order-status";

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  q: z.string().trim().optional(),
});

export const orderListQuerySchema = listQuerySchema.extend({
  status: z.enum(OrderStatus).optional(),
  customerId: z.string().optional(),
  customerVehicleId: z.string().optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
