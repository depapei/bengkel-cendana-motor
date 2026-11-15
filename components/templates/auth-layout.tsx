"use client";

import type { ReactNode } from "react";
import { Card } from "antd";
import { AppLogo } from "@/components/atoms/app-logo";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
      <Card className="w-full max-w-sm" title={<AppLogo />}>
        {children}
      </Card>
    </main>
  );
}
