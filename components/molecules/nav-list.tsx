"use client";

import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import type { NavItem } from "@/constants/navigation";

interface NavListProps {
  title?: string;
  items: NavItem[];
}

/** Daftar menu bergaya pengaturan aplikasi mobile: ikon, label, keterangan, dan chevron. */
export function NavList({ title, items }: NavListProps) {
  return (
    <Card title={title} styles={{ body: { padding: 0 } }}>
      <div className="divide-y divide-stone-100">
        {items.map((item) => (
          <Link
            key={item.route}
            href={item.route}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-stone-50 active:bg-stone-100"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-lg text-stone-700">
              <item.icon />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <Typography.Text strong>{item.label}</Typography.Text>
              {item.description && (
                <Typography.Text type="secondary" className="truncate text-xs">
                  {item.description}
                </Typography.Text>
              )}
            </span>
            <Typography.Text type="secondary" className="text-xs">
              <RightOutlined />
            </Typography.Text>
          </Link>
        ))}
      </div>
    </Card>
  );
}
