import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderList } from "@/components/organisms/order-list";

export const metadata: Metadata = { title: "Order Servis" };

export default function OrdersPage() {
  // OrderList membaca `?status=` via useSearchParams → wajib di dalam Suspense agar halaman tetap bisa di-prerender.
  return (
    <Suspense>
      <OrderList />
    </Suspense>
  );
}
