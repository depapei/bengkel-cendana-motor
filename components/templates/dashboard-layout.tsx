"use client";

import { useState, type ReactNode } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { AppLogo } from "@/components/atoms/app-logo";
import { IconButton } from "@/components/atoms/icon-button";
import { AppNavigation } from "@/components/organisms/app-navigation";
import { MobileDock } from "@/components/organisms/mobile-dock";
import { UserMenu } from "@/components/organisms/user-menu";

const SIDER_WIDTH = 240;
const SIDER_COLLAPSED_WIDTH = 80;

/**
 * Desktop (lg+): sidebar + header. Mobile: tanpa header & sidebar — navigasi lewat floating dock
 * di bawah, akun & menu lainnya di halaman Pengaturan. Semua lewat CSS breakpoint, jadi tidak ada
 * kedipan layout saat hydration.
 */
export function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      {/* Menu inline di dalam Sider otomatis ikut ciut & menampilkan Tooltip saat hover. */}
      <Layout.Sider
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        collapsible
        collapsed={collapsed}
        trigger={null}
        className="sticky top-0 hidden h-screen lg:block"
      >
        <div className={`flex py-6 ${collapsed ? "justify-center px-2" : "px-6"}`}>
          <AppLogo inverted iconOnly={collapsed} />
        </div>
        <div className="px-2">
          <AppNavigation />
        </div>
      </Layout.Sider>

      <Layout className="min-w-0 pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
        <Layout.Header className="sticky top-0 z-10 hidden items-center justify-between gap-4 border-b border-stone-200 px-8 lg:flex">
          <IconButton
            label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            tooltipPlacement="right"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
          />
          <UserMenu />
        </Layout.Header>
        {/* Jarak antar-blok halaman diatur sekali di sini. Bawah mobile diberi ruang untuk dock. */}
        <Layout.Content className="flex flex-col gap-6 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:px-8 md:pt-8 lg:pb-8">
          {children}
        </Layout.Content>
      </Layout>

      <MobileDock />
    </Layout>
  );
}
