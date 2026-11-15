"use client";

import { useState } from "react";
import Link from "next/link";
import { Flex, Typography } from "antd";
import { QtyDelta } from "@/components/atoms/qty-delta";
import { StatusTag } from "@/components/atoms/status-tag";
import { DataView } from "@/components/molecules/data-view";
import { EnumCheckboxGroup } from "@/components/molecules/enum-checkbox-group";
import { ExportButton } from "@/components/molecules/export-button";
import { StatCard } from "@/components/molecules/stat-card";
import { StockMovementCard } from "@/components/molecules/stock-movement-card";
import { TableCard } from "@/components/molecules/table-card";
import { ViewModeToggle } from "@/components/molecules/view-mode-toggle";
import { ReportKind } from "@/constants/report";
import { AppRoute } from "@/constants/routes";
import { STOCK_MOVEMENT_TYPE_META } from "@/constants/stock-movement";
import { ViewMode } from "@/constants/view-mode";
import { useExportReport, useStockReport } from "@/hooks/queries/use-reports";
import type { ListState } from "@/hooks/use-list-params";
import type { ReportStockMovement, StockReportParams } from "@/types/report";
import { formatDateTime } from "@/utils/format";
import { buildUrl } from "@/utils/url";

export function StockReport({ list }: { list: ListState<StockReportParams> }) {
  const { params, setFilter, pagination } = list;
  const { data, isFetching } = useStockReport(params);
  const [view, setView] = useState(ViewMode.Table);
  const exportReport = useExportReport();

  return (
    <Flex vertical gap={16}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Jumlah Pergerakan" value={data?.total ?? 0} loading={!data} />
        <StatCard title="Qty Masuk" value={data?.summary.qtyIn ?? 0} loading={!data} />
        <StatCard title="Qty Keluar" value={data?.summary.qtyOut ?? 0} loading={!data} />
      </div>
      <TableCard
        toolbar={
          <Flex vertical gap={8} className="w-full">
            <Flex justify="space-between" align="center" wrap gap={8}>
              <Typography.Text strong>Jenis Pergerakan</Typography.Text>
              <Flex gap={8}>
                <ExportButton
                  loading={exportReport.isPending}
                  onExport={(format) =>
                    exportReport.mutate({
                      format,
                      target: { kind: ReportKind.StockMovements, filter: { from: params.from, to: params.to, type: params.type } },
                    })
                  }
                />
                <ViewModeToggle value={view} onChange={setView} />
              </Flex>
            </Flex>
            <EnumCheckboxGroup meta={STOCK_MOVEMENT_TYPE_META} value={params.type} onChange={(type) => setFilter({ type })} />
          </Flex>
        }
      >
        <DataView<ReportStockMovement>
          view={view}
          loading={isFetching}
          dataSource={data?.items}
          pagination={pagination(data?.total)}
          renderItem={(movement) => <StockMovementCard movement={movement} />}
          columns={[
            { title: "Waktu", dataIndex: "createdAt", render: formatDateTime },
            {
              title: "Sparepart",
              key: "sparePart",
              render: (_, movement) => (
                <Link href={buildUrl(AppRoute.SparePartDetail, { id: movement.sparePart.id })}>
                  {movement.sparePart.name}
                </Link>
              ),
            },
            {
              title: "Jenis",
              dataIndex: "type",
              render: (type: ReportStockMovement["type"]) => <StatusTag value={type} meta={STOCK_MOVEMENT_TYPE_META} />,
            },
            { title: "Qty", dataIndex: "qty", align: "right", render: (qty: number) => <QtyDelta qty={qty} /> },
            {
              title: "Order",
              dataIndex: "order",
              render: (order: ReportStockMovement["order"]) =>
                order ? <Link href={buildUrl(AppRoute.OrderDetail, { id: order.id })}>{order.orderNo}</Link> : "-",
            },
            { title: "Catatan", dataIndex: "note", render: (note: string | null) => note ?? "-" },
          ]}
        />
      </TableCard>
    </Flex>
  );
}
