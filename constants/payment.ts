import { PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";
import type { EnumMeta } from "@/types/common";

export { PaymentMethod, PaymentStatus };

export const PAYMENT_STATUS_META: EnumMeta<PaymentStatus> = {
  [PaymentStatus.unpaid]: { label: "Belum Bayar", color: "gold" },
  [PaymentStatus.paid]: { label: "Lunas", color: "green" },
};

export const PAYMENT_METHOD_META: EnumMeta<PaymentMethod> = {
  [PaymentMethod.cash]: { label: "Tunai", color: "green" },
  [PaymentMethod.transfer]: { label: "Transfer", color: "blue" },
  [PaymentMethod.qris]: { label: "QRIS", color: "purple" },
};
