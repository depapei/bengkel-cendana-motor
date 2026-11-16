import type { ComponentType } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AppRoute } from "./routes";

export interface NavItem {
  route: AppRoute;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Keterangan singkat, tampil di daftar menu halaman Pengaturan. */
  description?: string;
  adminOnly?: boolean;
  /** Tampil di floating dock mobile. Menu lain diakses lewat halaman Pengaturan. */
  dock?: boolean;
}

/** Menu utama aplikasi — sumber tunggal sidebar desktop, dock mobile, dan halaman Pengaturan. */
export const NAV_ITEMS: NavItem[] = [
  { route: AppRoute.Home, label: "Dashboard", icon: DashboardOutlined, dock: true },
  { route: AppRoute.Orders, label: "Order Servis", icon: FileTextOutlined, dock: true },
  { route: AppRoute.Customers, label: "Customer", icon: TeamOutlined, description: "Data customer & kendaraannya" },
  { route: AppRoute.SpareParts, label: "Sparepart", icon: AppstoreOutlined, dock: true },
  { route: AppRoute.Brands, label: "Merek Motor", icon: CarOutlined, description: "Master merek & tipe kendaraan" },
  { route: AppRoute.Mechanics, label: "Mekanik", icon: ToolOutlined, description: "Mekanik yang bisa ditugaskan" },
  { route: AppRoute.Reports, label: "Laporan", icon: BarChartOutlined, adminOnly: true, dock: true },
  { route: AppRoute.Users, label: "User", icon: UserOutlined, description: "Akun login admin & kasir", adminOnly: true },
];

/** Item terakhir dock mobile: akun + menu yang tidak muat di dock. */
export const SETTINGS_NAV_ITEM: NavItem = { route: AppRoute.Settings, label: "Pengaturan", icon: SettingOutlined };
