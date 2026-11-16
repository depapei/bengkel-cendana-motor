"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Card, Statistic } from "antd";
import { formatRupiah } from "@/utils/format";

interface StatCardProps {
  title: ReactNode;
  value: number;
  /** Tampilkan nilai sebagai Rupiah. */
  money?: boolean;
  loading?: boolean;
  /** Jika diisi, seluruh kartu menjadi link. */
  href?: string;
  /** `small` = kartu & angka lebih ringkas (mis. papan antrean). */
  size?: "default" | "small";
}

/** Kartu angka ringkasan (dashboard & laporan). */
export function StatCard({ title, value, money, loading, href, size = "default" }: StatCardProps) {
  const small = size === "small";
  const card = (
    <Card hoverable={!!href} size={small ? "small" : "default"} className="h-full">
      <Statistic
        classNames={small ? { title: "mb-1", content: "text-xl" } : undefined}
        title={title}
        value={value}
        loading={loading}
        formatter={money ? (raw) => formatRupiah(Number(raw)) : undefined}
      />
    </Card>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}
