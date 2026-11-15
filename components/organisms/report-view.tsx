"use client";

import { Tabs } from "antd";
import { currentMonthRange, DateRangeFilter } from "@/components/molecules/date-range-filter";
import { PageHeader } from "@/components/molecules/page-header";
import { useListParams } from "@/hooks/use-list-params";
import type { DateRange, OrderReportParams, StockReportParams } from "@/types/report";
import { OrderReport } from "./order-report";
import { StockReport } from "./stock-report";

/** Halaman laporan: satu rentang tanggal untuk laporan order & pergerakan stok. */
export function ReportView() {
  const orderList = useListParams<OrderReportParams>(currentMonthRange());
  const stockList = useListParams<StockReportParams>(currentMonthRange());

  const range: DateRange = { from: orderList.params.from, to: orderList.params.to };
  const changeRange = (next: DateRange) => {
    orderList.setFilter(next);
    stockList.setFilter(next);
  };

  return (
    <>
      <PageHeader
        title="Laporan"
        subtitle="Order servis dan pergerakan stok sparepart per periode"
        extra={<DateRangeFilter value={range} onChange={changeRange} />}
      />
      <Tabs
        items={[
          { key: "orders", label: "Order Servis", children: <OrderReport list={orderList} /> },
          { key: "stock", label: "Pergerakan Stok", children: <StockReport list={stockList} /> },
        ]}
      />
    </>
  );
}
