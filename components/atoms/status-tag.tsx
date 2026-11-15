"use client";

import { Tag } from "antd";
import type { EnumMeta } from "@/types/common";

interface StatusTagProps<T extends string> {
  value: T | null | undefined;
  meta: EnumMeta<T>;
}

/** Tag untuk semua enum (status order, pembayaran, role, jenis stok). */
export function StatusTag<T extends string>({ value, meta }: StatusTagProps<T>) {
  if (!value) return null;
  return <Tag color={meta[value].color}>{meta[value].label}</Tag>;
}
