import type { Metadata } from "next";
import { ReportView } from "@/components/organisms/report-view";

export const metadata: Metadata = { title: "Laporan" };

export default function ReportsPage() {
  return <ReportView />;
}
