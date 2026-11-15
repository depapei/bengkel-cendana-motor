import { APP_NAME, WHATSAPP_BASE_URL } from "@/constants/app";
import { PAYMENT_METHOD_META, PAYMENT_STATUS_META } from "@/constants/payment";
import type { OrderDetail } from "@/types/order";
import { formatDateTime, formatMileage, formatRupiah } from "./format";
import { formatNextService } from "./order";
import { toInternationalPhone } from "./normalize";

export function buildInvoiceMessage(order: OrderDetail): string {
  const items = order.serviceFees.map((item) => `- ${item.name} x${item.qty}: ${formatRupiah(item.subtotal)}`);
  const payment = order.paymentMethod
    ? `${PAYMENT_STATUS_META[order.paymentStatus].label} (${PAYMENT_METHOD_META[order.paymentMethod].label})`
    : PAYMENT_STATUS_META[order.paymentStatus].label;

  return [
    `*Nota Servis ${APP_NAME}*`,
    `No: ${order.orderNo}`,
    `Tanggal: ${formatDateTime(order.createdAt)}`,
    `Kendaraan: ${order.customerVehicle.platNomor} (${order.customerVehicle.brand.name} ${order.customerVehicle.brand.type})`,
    `Kilometer: ${formatMileage(order.mileage)}`,
    "",
    ...items,
    "",
    `*Total: ${formatRupiah(order.totalPrice)}*`,
    `Status bayar: ${payment}`,
    ...(order.nextServiceDate || order.nextServiceNote ? ["", `Service selanjutnya: ${formatNextService(order)}`] : []),
    "",
    "Terima kasih",
  ].join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
  return `${WHATSAPP_BASE_URL}/${toInternationalPhone(phone)}?text=${encodeURIComponent(message)}`;
}
