"use client";

import { useState, type ReactNode } from "react";
import { MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Drawer, Layout } from "antd";
import { AppLogo } from "@/components/atoms/app-logo";
import { IconButton } from "@/components/atoms/icon-button";
import { AppNavigation } from "@/components/organisms/app-navigation";
import { UserMenu } from "@/components/organisms/user-menu";
import { SIDEBAR_BG } from "@/lib/antd-theme";

const SIDER_WIDTH = 240;
const SIDER_COLLAPSED_WIDTH = 80;

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
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

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        size={SIDER_WIDTH}
        title={<AppLogo />}
        styles={{ body: { padding: 8, background: SIDEBAR_BG } }}
      >
        <AppNavigation onNavigate={() => setDrawerOpen(false)} />
      </Drawer>

      <Layout>
        <Layout.Header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-stone-200 px-4 md:px-8">
          {/* Mobile: buka drawer. Desktop: buka/tutup sidebar. */}
          <Button
            size="large"
            type="text"
            icon={<MenuOutlined />}
            aria-label="Buka menu"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
          />
          <IconButton
            label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
            tooltipPlacement="right"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            className="hidden lg:inline-flex"
            onClick={() => setCollapsed((prev) => !prev)}
          />
          <UserMenu />
        </Layout.Header>
        {/* Jarak antar-blok halaman diatur sekali di sini. */}
        <Layout.Content className="flex flex-col gap-6 p-4 md:p-8">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
