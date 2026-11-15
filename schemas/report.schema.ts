import { z } from "zod";
import { OrderStatus } from "@/constants/order-status";
import { PaymentStatus } from "@/constants/payment";
import { ExportFormat } from "@/constants/report";
import { StockMovementType } from "@/constants/stock-movement";
import { csvEnum } from "./common";
import { listQuerySchema } from "./list.schema";

const rangeShape = {
  from: z.coerce.date({ error: "Tanggal awal wajib diisi" }),
  to: z.coerce.date({ error: "Tanggal akhir wajib diisi" }),
};
const orderFilterShape = { status: csvEnum(OrderStatus), paymentStatus: csvEnum(PaymentStatus) };
const stockFilterShape = { type: csvEnum(StockMovementType) };
const exportShape = { format: z.enum(ExportFormat, { error: "Format export tidak valid" }) };

const validRange = (value: { from: Date; to: Date }) => value.from <= value.to;
const rangeError = { path: ["to"], message: "Tanggal akhir harus setelah tanggal awal" };

export const orderReportQuerySchema = listQuerySchema
  .extend({ ...rangeShape, ...orderFilterShape })
  .refine(validRange, rangeError);

export const stockReportQuerySchema = listQuerySchema
  .extend({ ...rangeShape, ...stockFilterShape })
  .refine(validRange, rangeError);

export const orderExportQuerySchema = z
  .object({ ...rangeShape, ...orderFilterShape, ...exportShape })
  .refine(validRange, rangeError);

export const stockExportQuerySchema = z
  .object({ ...rangeShape, ...stockFilterShape, ...exportShape })
  .refine(validRange, rangeError);

export type OrderReportQuery = z.output<typeof orderReportQuerySchema>;
export type StockReportQuery = z.output<typeof stockReportQuerySchema>;
export type OrderExportQuery = z.output<typeof orderExportQuerySchema>;
export type StockExportQuery = z.output<typeof stockExportQuerySchema>;
/** Filter laporan order tanpa paging / format. */
export type OrderReportFilter = Omit<OrderReportQuery, "page" | "pageSize" | "q">;
export type StockReportFilter = Omit<StockReportQuery, "page" | "pageSize" | "q">;
