import { z } from "zod";
import { idSchema, phoneNumber, platNomor, requiredString } from "./common";

export const vehicleSchema = z.object({
  brandId: idSchema("Merek/tipe motor"),
  platNomor: platNomor(),
});

export const customerSchema = z.object({
  name: requiredString("Nama customer"),
  phoneNumber: phoneNumber(),
});

/** Customer baru boleh langsung didaftarkan bersama kendaraan pertamanya. */
export const customerCreateSchema = customerSchema.extend({
  vehicle: vehicleSchema.optional(),
});

export type VehicleInput = z.input<typeof vehicleSchema>;
export type VehicleData = z.output<typeof vehicleSchema>;
export type CustomerInput = z.input<typeof customerSchema>;
export type CustomerData = z.output<typeof customerSchema>;
export type CustomerCreateInput = z.input<typeof customerCreateSchema>;
export type CustomerCreateData = z.output<typeof customerCreateSchema>;
