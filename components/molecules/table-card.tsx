"use client";

import type { ReactNode } from "react";
import { Card, Flex } from "antd";

interface TableCardProps {
  title?: ReactNode;
  extra?: ReactNode;
  /** Pencarian / filter di atas tabel. */
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Kartu pembungkus tabel dengan toolbar opsional. */
export function TableCard({ title, extra, toolbar, children, className }: TableCardProps) {
  return (
    <Card title={title} extra={extra} className={className} styles={{ body: { padding: 0 } }}>
      {toolbar && (
        <Flex gap={12} wrap align="center" className="px-6 pt-5 pb-1">
          {toolbar}
        </Flex>
      )}
      <div className="p-2">{children}</div>
    </Card>
  );
}
