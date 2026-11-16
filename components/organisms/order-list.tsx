"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { orderListQuerySchema } from "@/schemas/list.schema";
import type { OrderListParams } from "@/types/order";
import { withQuery } from "@/utils/url";
import { OrderTable } from "./order-table";

const ALL_TAB = "all";

const STATUS_TABS = [
  { key: ALL_TAB, label: "Semua" },
  ...Object.values(OrderStatus).map((status) => ({ key: status, label: ORDER_STATUS_META[status].label })),
];

/** Status tidak valid di URL → abaikan (tab "Semua"). */
const parseStatus = (value: string | null) => orderListQuerySchema.shape.status.catch(undefined).parse(value ?? undefined);

/**
 * Tab status mengikuti query `?status=` (mis. dari kartu status di dashboard).
 * URL jadi sumber kebenaran karena dengan `cacheComponents` halaman ini tetap ter-mount
 * (Activity) saat ditinggal, sehingga state awal tidak dibuat ulang ketika kembali.
 */
export function OrderList() {
  const urlStatus = parseStatus(useSearchParams().get("status"));
  const { params, setFilter, pagination } = useListParams<OrderListParams>({ status: urlStatus });

  // URL berubah dari luar (link dashboard) → samakan filter & kembali ke halaman 1.
  const [syncedStatus, setSyncedStatus] = useState(urlStatus);
  if (urlStatus !== syncedStatus) {
    setSyncedStatus(urlStatus);
    setFilter({ status: urlStatus });
  }

  const changeStatus = (status?: OrderStatus) => {
    setSyncedStatus(status);
    setFilter({ status });
    // Simpan tab di URL tanpa request ulang ke server, supaya refresh/back tetap di tab yang sama.
    window.history.replaceState(null, "", withQuery(AppRoute.Orders, { status }));
  };
  const [view, setView] = useState(DEFAULT_VIEW_MODE);

  return (
    <>
      <PageHeader
        title="Order Servis"
        subtitle="Daftar order per status"
        extra={
          <Link href={AppRoute.OrderNew}>
            <Button size="large" type="primary" icon={<PlusOutlined />}>
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
              onChange={(key) => changeStatus(key === ALL_TAB ? undefined : (key as OrderStatus))}
            />
          </>
        }
      >
        <OrderTable params={params} pagination={pagination} view={view} />
      </TableCard>
    </>
  );
}
