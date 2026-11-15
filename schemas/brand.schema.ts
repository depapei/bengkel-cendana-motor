import { z } from "zod";
import { upperString } from "./common";

export const brandSchema = z.object({
  name: upperString("Merek"),
  type: upperString("Tipe"),
});

export type BrandInput = z.input<typeof brandSchema>;
export type BrandData = z.output<typeof brandSchema>;
