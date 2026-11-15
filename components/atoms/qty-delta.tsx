"use client";

import { Typography } from "antd";

/** Qty pergerakan stok: hijau `+n` untuk masuk, merah `-n` untuk keluar. */
export function QtyDelta({ qty }: { qty: number }) {
  return <Typography.Text type={qty < 0 ? "danger" : "success"}>{qty > 0 ? `+${qty}` : qty}</Typography.Text>;
}
