import type { Metadata } from "next";
import { BrandManager } from "@/components/organisms/brand-manager";

export const metadata: Metadata = { title: "Merek Motor" };

export default function BrandsPage() {
  return <BrandManager />;
}
