"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Layout, Typography } from "antd";
import { AppLogo } from "@/components/atoms/app-logo";
import { APP_NAME } from "@/constants/app";
import { AppRoute } from "@/constants/routes";

/** Kerangka halaman publik untuk customer (tanpa sidebar & tanpa login). */
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Layout className="min-h-screen">
      <Layout.Header className="sticky top-0 z-10 flex items-center border-b border-stone-200 px-4 md:px-8">
        <Link href={AppRoute.Queue}>
          <AppLogo />
        </Link>
      </Layout.Header>
      <Layout.Content className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">{children}</Layout.Content>
      <Layout.Footer className="text-center">
        <Typography.Text type="secondary" className="text-base">
          © {new Date().getFullYear()} {APP_NAME}
        </Typography.Text>
      </Layout.Footer>
    </Layout>
  );
}
