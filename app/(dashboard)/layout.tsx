import { DashboardLayout } from "@/components/templates/dashboard-layout";

export default function Layout({ children }: LayoutProps<"/">) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
