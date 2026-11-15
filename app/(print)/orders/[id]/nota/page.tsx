import type { Metadata } from "next";
import { OrderInvoice } from "@/components/organisms/order-invoice";
import { PrintLayout } from "@/components/templates/print-layout";

export const metadata: Metadata = { title: "Nota" };

export default async function OrderInvoicePage({ params }: PageProps<"/orders/[id]/nota">) {
  const { id } = await params;
  return (
    <PrintLayout>
      <OrderInvoice id={id} />
    </PrintLayout>
  );
}
