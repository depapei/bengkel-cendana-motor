import type { Metadata } from "next";
import { OrderCreateForm } from "@/components/organisms/order-create-form";

export const metadata: Metadata = { title: "Order Baru" };

export default function NewOrderPage() {
  return <OrderCreateForm />;
}
