"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import { PageHeader } from "@/components/molecules/page-header";
import { SearchInput } from "@/components/molecules/search-input";
import { TableCard } from "@/components/molecules/table-card";
import { ViewModeToggle } from "@/components/molecules/view-mode-toggle";
import { ORDER_STATUS_META, OrderStatus } from "@/constants/order-status";
import { AppRoute } from "@/constants/routes";
import { DEFAULT_VIEW_MODE } from "@/constants/view-mode";
import { useListParams } from "@/hooks/use-list-params";
import type { OrderListParams } from "@/types/order";
import { OrderTable } from "./order-table";

const ALL_TAB = "all";

const STATUS_TABS = [
  { key: ALL_TAB, label: "Semua" },
  ...Object.values(OrderStatus).map((status) => ({ key: status, label: ORDER_STATUS_META[status].label })),
];

export function OrderList() {
  const { params, setFilter, pagination } = useListParams<OrderListParams>();
  const [view, setView] = useState(DEFAULT_VIEW_MODE);

  return (
    <>
      <PageHeader
        title="Order Servis"
        subtitle="Daftar order per status"
        extra={
          <Link href={AppRoute.OrderNew}>
            <Button type="primary" icon={<PlusOutlined />}>
              Order Baru
            </Button>
          </Link>
        }
      />
      <TableCard
        toolbar={
          <>
            <SearchInput placeholder="Cari no. order, nama, nomor HP, atau plat" onSearch={(q) => setFilter({ q })} />
            <ViewModeToggle value={view} onChange={setView} />
            <Tabs
              className="w-full"
              tabBarStyle={{ marginBottom: 0 }}
              items={STATUS_TABS}
              activeKey={params.status ?? ALL_TAB}
              onChange={(key) => setFilter({ status: key === ALL_TAB ? undefined : (key as OrderStatus) })}
            />
          </>
        }
      >
        <OrderTable params={params} pagination={pagination} view={view} />
      </TableCard>
    </>
  );
}
