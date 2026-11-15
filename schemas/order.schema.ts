import { z } from "zod";
import { MESSAGE } from "@/constants/messages";
import { OrderStatus } from "@/constants/order-status";
import { PaymentMethod } from "@/constants/payment";
import { idSchema, money, nonNegativeInt, optionalDate, optionalString, positiveInt, requiredString } from "./common";

const orderBaseSchema = z.object({
  complaint: requiredString("Keluhan"),
  notes: optionalString(),
  mileage: nonNegativeInt("Kilometer motor"),
  mechanicId: optionalString(),
  /** Catatan internal mekanik — hanya boleh diisi bila mekanik sudah ditugaskan. */
  mechanicNote: optionalString(),
  /** Rekomendasi service selanjutnya. */
  nextServiceDate: optionalDate(),
  nextServiceNote: optionalString(),
});

const withMechanicNoteRule = <T extends z.ZodType<{ mechanicId: string | null; mechanicNote: string | null }>>(schema: T) =>
  schema.refine((value) => !value.mechanicNote || !!value.mechanicId, {
    path: ["mechanicNote"],
    message: MESSAGE.mechanicRequired,
  });

export const orderSchema = withMechanicNoteRule(orderBaseSchema);

export const orderCreateSchema = withMechanicNoteRule(
  orderBaseSchema.extend({
    customerVehicleId: idSchema("Kendaraan"),
  }),
);

/** sparepartId kosong = jasa saja. */
export const serviceFeeSchema = z.object({
  sparepartId: optionalString(),
  name: requiredString("Nama pekerjaan"),
  qty: positiveInt("Qty"),
  laborPrice: money("Harga jasa"),
});

export const stockReturnSchema = z.object({
  serviceFeeId: idSchema("Item"),
  qty: money("Qty kembali"),
});

export const orderStatusChangeSchema = z
  .object({
    status: z.enum(OrderStatus),
    cancelReason: optionalString(),
    /** Hanya untuk in-progress → cancelled: sparepart yang belum terpakai. */
    returns: z.array(stockReturnSchema).optional(),
  })
  .refine((value) => value.status !== OrderStatus.cancelled || !!value.cancelReason, {
    path: ["cancelReason"],
    message: "Alasan pembatalan wajib diisi",
  });

export const paymentSchema = z.object({
  paymentMethod: z.enum(PaymentMethod, { error: "Metode pembayaran wajib dipilih" }),
});

export type OrderInput = z.input<typeof orderSchema>;
export type OrderData = z.output<typeof orderSchema>;
export type OrderCreateInput = z.input<typeof orderCreateSchema>;
export type OrderCreateData = z.output<typeof orderCreateSchema>;
export type ServiceFeeInput = z.input<typeof serviceFeeSchema>;
export type ServiceFeeData = z.output<typeof serviceFeeSchema>;
export type OrderStatusChangeInput = z.input<typeof orderStatusChangeSchema>;
export type OrderStatusChangeData = z.output<typeof orderStatusChangeSchema>;
export type PaymentInput = z.input<typeof paymentSchema>;
export type PaymentData = z.output<typeof paymentSchema>;
