import type { Metadata } from "next";
import { OrderDetail } from "@/components/organisms/order-detail";

export const metadata: Metadata = { title: "Detail Order" };

export default async function OrderDetailPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
