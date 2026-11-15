import { z } from "zod";
import { UserRole } from "@/constants/user-role";
import { requiredString } from "./common";

const PASSWORD_MIN = 6;
const passwordRule = z.string().min(PASSWORD_MIN, `Password minimal ${PASSWORD_MIN} karakter`);

const userBaseSchema = z.object({
  name: requiredString("Nama"),
  username: requiredString("Username")
    .toLowerCase()
    .regex(/^[a-z0-9_.]+$/, "Username hanya huruf kecil, angka, titik, dan underscore"),
  role: z.enum(UserRole, { error: "Role wajib dipilih" }),
});

export const userCreateSchema = userBaseSchema.extend({ password: passwordRule });

/** Password kosong saat edit = tidak diubah. */
export const userUpdateSchema = userBaseSchema.extend({
  password: z.union([z.literal(""), passwordRule]).optional(),
});

export type UserCreateInput = z.input<typeof userCreateSchema>;
export type UserCreateData = z.output<typeof userCreateSchema>;
export type UserUpdateInput = z.input<typeof userUpdateSchema>;
export type UserUpdateData = z.output<typeof userUpdateSchema>;
