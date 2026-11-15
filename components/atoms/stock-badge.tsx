"use client";

import { Typography } from "antd";

interface StockBadgeProps {
  stock: number;
  /** Jumlah yang dibutuhkan; merah jika stok kurang. */
  required?: number;
}

export function StockBadge({ stock, required = 1 }: StockBadgeProps) {
  return <Typography.Text type={stock < required ? "danger" : undefined}>{stock}</Typography.Text>;
}
