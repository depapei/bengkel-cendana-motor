"use client";

import { Typography } from "antd";
import { formatRupiah } from "@/utils/format";

interface MoneyProps {
  value: number | null | undefined;
  strong?: boolean;
}

export function Money({ value, strong }: MoneyProps) {
  return <Typography.Text strong={strong}>{formatRupiah(value)}</Typography.Text>;
}
