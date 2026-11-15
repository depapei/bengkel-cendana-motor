import type { Metadata } from "next";
import { DashboardOverview } from "@/components/organisms/dashboard-overview";

export const metadata: Metadata = { title: "Dashboard" };

export default function HomePage() {
  return <DashboardOverview />;
}
