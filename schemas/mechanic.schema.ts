import { z } from "zod";
import { requiredString } from "./common";

export const mechanicSchema = z.object({
  name: requiredString("Nama mekanik"),
});

export type MechanicInput = z.input<typeof mechanicSchema>;
export type MechanicData = z.output<typeof mechanicSchema>;
