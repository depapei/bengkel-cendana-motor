"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Card } from "antd";

interface ListCardProps {
  title: ReactNode;
  /** Tag/status di kanan judul; turun ke baris berikutnya bila tidak muat. */
  extra?: ReactNode;
  children?: ReactNode;
  /** Selalu menempel di bagian bawah card (total, tombol aksi). */
  footer?: ReactNode;
  /** Seluruh card menjadi link. */
  href?: string;
  onClick?: () => void;
}

/**
 * Kerangka satu item di daftar card (`DataGrid`). Font & padding dibuat ringkas di mobile
 * (grid 2 kolom) dan lebih lega di desktop.
 */
export function ListCard({ title, extra, children, footer, href, onClick }: ListCardProps) {
  const interactive = !!href || !!onClick;

  const card = (
    <Card
      hoverable={interactive}
      onClick={onClick}
      className={`h-full ${interactive ? "cursor-pointer max-lg:active:bg-stone-50" : ""}`}
      classNames={{ body: "h-full p-3 text-xs leading-snug lg:p-5 lg:text-sm" }}
    >
      <div className="flex h-full flex-col gap-1.5 lg:gap-2">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          <div className="min-w-0 text-[13px] font-semibold break-words lg:text-base">{title}</div>
          {extra && <div className="shrink-0">{extra}</div>}
        </div>
        {children}
        {footer && <div className="mt-auto pt-1">{footer}</div>}
      </div>
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
