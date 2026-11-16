"use client";

import Link from "next/link";
import { Button } from "antd";
import type { NavItem } from "@/constants/navigation";

interface DockItemProps {
  item: NavItem;
  active: boolean;
}

/** Satu tombol menu di floating dock mobile: ikon di atas, label di bawah. */
export function DockItem({ item, active }: DockItemProps) {
  return (
    <Link href={item.route} aria-current={active ? "page" : undefined} className="min-w-0 flex-1">
      {/* Fokus keyboard cukup di Link; Button hanya untuk tampilan & warna tema. */}
      <Button
        tabIndex={-1}
        block
        color={active ? "primary" : "default"}
        variant={active ? "filled" : "text"}
        className="h-auto flex-col gap-0.5 rounded-xl px-0.5 py-1.5"
      >
        <item.icon className="text-xl leading-none" />
        <span className="w-full truncate text-[11px] leading-tight font-medium">{item.label}</span>
      </Button>
    </Link>
  );
}
