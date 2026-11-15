"use client";

import type { ReactNode } from "react";
import { Flex, Typography } from "antd";
import { BackButton } from "@/components/atoms/back-button";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  /** Isi untuk halaman detail: menampilkan tombol "Kembali" ke halaman ini. */
  backHref?: string;
}

export function PageHeader({ title, subtitle, extra, backHref }: PageHeaderProps) {
  return (
    <Flex vertical gap={12}>
      {backHref && (
        <div>
          <BackButton href={backHref} />
        </div>
      )}
      <Flex justify="space-between" align="flex-start" wrap gap={16}>
        <Flex vertical gap={4}>
          <Typography.Title level={3} className="mb-0">
            {title}
          </Typography.Title>
          {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
        </Flex>
        {extra && (
          <Flex gap={8} wrap align="center">
            {extra}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
