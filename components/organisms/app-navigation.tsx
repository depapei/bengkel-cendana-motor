"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import { AppRoute } from "@/constants/routes";
import { useMe } from "@/hooks/queries/use-auth";

const NAV_ITEMS = [
  { route: AppRoute.Home, label: "Dashboard", icon: <DashboardOutlined /> },
  { route: AppRoute.Orders, label: "Order Servis", icon: <FileTextOutlined /> },
  { route: AppRoute.Customers, label: "Customer", icon: <TeamOutlined /> },
  { route: AppRoute.SpareParts, label: "Sparepart", icon: <AppstoreOutlined /> },
  { route: AppRoute.Brands, label: "Merek Motor", icon: <CarOutlined /> },
  { route: AppRoute.Reports, label: "Laporan", icon: <BarChartOutlined />, adminOnly: true },
  { route: AppRoute.Users, label: "User", icon: <UserOutlined />, adminOnly: true },
];

export function AppNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isAdmin } = useMe();

  const items: MenuProps["items"] = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => ({
    key: item.route,
    icon: item.icon,
    label: (
      <Link href={item.route} onClick={onNavigate}>
        {item.label}
      </Link>
    ),
  }));

  // Home ("/") harus cocok persis, karena semua path diawali "/".
  const isActive = (route: AppRoute) => (route === AppRoute.Home ? pathname === route : pathname.startsWith(route));
  const selected = NAV_ITEMS.find((item) => isActive(item.route))?.route;

  return <Menu theme="dark" mode="inline" items={items} selectedKeys={selected ? [selected] : []} />;
}
