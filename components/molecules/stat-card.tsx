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
}

/** Kartu angka ringkasan (dashboard & laporan). */
export function StatCard({ title, value, money, loading, href }: StatCardProps) {
  const card = (
    <Card hoverable={!!href} className="h-full">
      <Statistic
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
