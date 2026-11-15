import type { Metadata } from "next";
import { SparePartDetail } from "@/components/organisms/spare-part-detail";

export const metadata: Metadata = { title: "Detail Sparepart" };

export default async function SparePartDetailPage({ params }: PageProps<"/spare-parts/[id]">) {
  const { id } = await params;
  return <SparePartDetail id={id} />;
}
