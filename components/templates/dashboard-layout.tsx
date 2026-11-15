"use client";

import { useState, type ReactNode } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Layout } from "antd";
import { AppLogo } from "@/components/atoms/app-logo";
import { AppNavigation } from "@/components/organisms/app-navigation";
import { UserMenu } from "@/components/organisms/user-menu";
import { SIDEBAR_BG } from "@/lib/antd-theme";

const SIDER_WIDTH = 240;

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Layout className="min-h-screen">
      <Layout.Sider width={SIDER_WIDTH} className="sticky top-0 hidden h-screen lg:block">
        <div className="px-6 py-6">
          <AppLogo inverted />
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
          <Button type="text" icon={<MenuOutlined />} className="lg:invisible" onClick={() => setDrawerOpen(true)} />
          <UserMenu />
        </Layout.Header>
        {/* Jarak antar-blok halaman diatur sekali di sini. */}
        <Layout.Content className="flex flex-col gap-6 p-4 md:p-8">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
