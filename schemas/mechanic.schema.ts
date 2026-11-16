import { z } from "zod";
import { optionalPhoneNumber, requiredString } from "./common";

export const mechanicSchema = z.object({
  name: requiredString("Nama mekanik"),
  phoneNumber: optionalPhoneNumber(),
});

/** Update per field (inline edit / toggle aktif): hanya field yang dikirim yang diubah. */
export const mechanicUpdateSchema = mechanicSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type MechanicInput = z.input<typeof mechanicSchema>;
export type MechanicData = z.output<typeof mechanicSchema>;
export type MechanicUpdateInput = z.input<typeof mechanicUpdateSchema>;
export type MechanicUpdateData = z.output<typeof mechanicUpdateSchema>;
