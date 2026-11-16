"use client";

import { useState } from "react";
import Link from "next/link";
import { Flex } from "antd";
import { TableCard } from "@/components/molecules/table-card";
import { ViewModeToggle } from "@/components/molecules/view-mode-toggle";
import { RECENT_ORDERS_LIMIT } from "@/constants/app";
import { AppRoute } from "@/constants/routes";
import { DEFAULT_VIEW_MODE } from "@/constants/view-mode";
import { OrderTable } from "@/components/organisms/order-table";

const RECENT_ORDERS_PARAMS = { page: 1, pageSize: RECENT_ORDERS_LIMIT };

/** Order terbaru di dashboard; bisa ditampilkan sebagai card atau tabel seperti halaman Order. */
export function RecentOrdersCard() {
  const [view, setView] = useState(DEFAULT_VIEW_MODE);

  return (
    <TableCard
      title="Order Terbaru"
      className="h-full"
      extra={
        <Flex gap={12} align="center">
          <ViewModeToggle value={view} onChange={setView} />
          <Link href={AppRoute.Orders}>Lihat semua</Link>
        </Flex>
      }
    >
      <OrderTable params={RECENT_ORDERS_PARAMS} view={view} />
    </TableCard>
  );
}
