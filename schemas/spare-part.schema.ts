import { z } from "zod";
import { MANUAL_STOCK_MOVEMENT_TYPES, StockMovementType } from "@/constants/stock-movement";
import { money, optionalString, requiredString } from "./common";

export const sparePartSchema = z.object({
  name: requiredString("Nama sparepart"),
  purchasePrice: money("Harga beli"),
  price: money("Harga jual"),
});

export const sparePartCreateSchema = sparePartSchema.extend({
  stock: money("Stok awal"),
});

/**
 * - in     : barang masuk, `qty` = jumlah yang masuk (> 0)
 * - adjust : stock opname, `qty` = jumlah stok fisik hasil hitung (>= 0)
 */
export const stockMovementSchema = z
  .object({
    type: z.enum(MANUAL_STOCK_MOVEMENT_TYPES),
    qty: money("Jumlah"),
    note: optionalString(),
  })
  .refine((value) => value.type !== StockMovementType.in || value.qty > 0, {
    path: ["qty"],
    message: "Jumlah barang masuk minimal 1",
  });

export type SparePartInput = z.input<typeof sparePartSchema>;
export type SparePartData = z.output<typeof sparePartSchema>;
export type SparePartCreateInput = z.input<typeof sparePartCreateSchema>;
export type SparePartCreateData = z.output<typeof sparePartCreateSchema>;
export type StockMovementInput = z.input<typeof stockMovementSchema>;
export type StockMovementData = z.output<typeof stockMovementSchema>;
