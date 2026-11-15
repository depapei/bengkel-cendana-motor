import { UserRole } from "@/generated/prisma/enums";
import type { EnumMeta } from "@/types/common";

export { UserRole };

export const USER_ROLE_META: EnumMeta<UserRole> = {
  [UserRole.admin]: { label: "Admin", color: "magenta" },
  [UserRole.kasir]: { label: "Kasir", color: "cyan" },
};

/** Role yang boleh mengakses fitur khusus admin. */
export const ADMIN_ONLY: UserRole[] = [UserRole.admin];
