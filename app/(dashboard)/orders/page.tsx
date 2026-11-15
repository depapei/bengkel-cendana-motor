import type { Metadata } from "next";
import { OrderList } from "@/components/organisms/order-list";

export const metadata: Metadata = { title: "Order Servis" };

export default function OrdersPage() {
  return <OrderList />;
}
