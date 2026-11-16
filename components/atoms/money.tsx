"use client";

import type { ReactNode } from "react";
import { Typography } from "antd";
import { formatRupiah } from "@/utils/format";

interface MoneyProps {
  value: number | null | undefined;
  strong?: boolean;
  /** Tampil (abu-abu) bila nilai kosong; tanpa ini nilai kosong ditulis Rp 0. */
  emptyText?: ReactNode;
}

export function Money({ value, strong, emptyText }: MoneyProps) {
  if ((value === null || value === undefined) && emptyText !== undefined) {
    return <Typography.Text type="secondary">{emptyText}</Typography.Text>;
  }
  return <Typography.Text strong={strong}>{formatRupiah(value)}</Typography.Text>;
}
