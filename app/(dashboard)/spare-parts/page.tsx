import type { Metadata } from "next";
import { SparePartManager } from "@/components/organisms/spare-part-manager";

export const metadata: Metadata = { title: "Sparepart" };

export default function SparePartsPage() {
  return <SparePartManager />;
}
