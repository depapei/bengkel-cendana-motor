import type { Metadata } from "next";
import { CustomerDetail } from "@/components/organisms/customer-detail";

export const metadata: Metadata = { title: "Detail Customer" };

export default async function CustomerDetailPage({ params }: PageProps<"/customers/[id]">) {
  const { id } = await params;
  return <CustomerDetail id={id} />;
}
