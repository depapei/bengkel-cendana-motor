"use client";

import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider } from "antd";
import idID from "antd/locale/id_ID";
import { antdTheme } from "@/lib/antd-theme";
import { getQueryClient } from "@/lib/query-client";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry layer>
      <ConfigProvider theme={antdTheme} locale={idID}>
        <App>
          <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
