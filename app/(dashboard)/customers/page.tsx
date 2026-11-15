import type { Metadata } from "next";
import { CustomerManager } from "@/components/organisms/customer-manager";

export const metadata: Metadata = { title: "Customer" };

export default function CustomersPage() {
  return <CustomerManager />;
}
