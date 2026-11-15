"use client";

import { useState } from "react";
import Link from "next/link";
import { Flex, Typography } from "antd";
import { Money } from "@/components/atoms/money";
import { StatusTag } from "@/components/atoms/status-tag";
import { DataView } from "@/components/molecules/data-view";
import { EnumCheckboxGroup } from "@/components/molecules/enum-checkbox-group";
import { ExportButton } from "@/components/molecules/export-button";
import { ReportOrderCard } from "@/components/molecules/report-order-card";
import { StatCard } from "@/components/molecules/stat-card";
import { TableCard } from "@/components/molecules/table-card";
import { ViewModeToggle } from "@/components/molecules/view-mode-toggle";
import { ORDER_STATUS_META } from "@/constants/order-status";
import { PAYMENT_STATUS_META } from "@/constants/payment";
import { ReportKind } from "@/constants/report";
import { AppRoute } from "@/constants/routes";
import { ViewMode } from "@/constants/view-mode";
import { useExportReport, useOrderReport } from "@/hooks/queries/use-reports";
import type { ListState } from "@/hooks/use-list-params";
import type { OrderReportParams, ReportOrder } from "@/types/report";
import { formatDateTime } from "@/utils/format";
import { buildUrl } from "@/utils/url";

export function OrderReport({ list }: { list: ListState<OrderReportParams> }) {
  const { params, setFilter, pagination } = list;
  const { data, isFetching } = useOrderReport(params);
  const [view, setView] = useState(ViewMode.Table);
  const exportReport = useExportReport();

  return (
    <Flex vertical gap={16}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Jumlah Order" value={data?.total ?? 0} loading={!data} />
        <StatCard title="Total Nilai Order" value={data?.summary.totalPrice ?? 0} money loading={!data} />
        <StatCard title="Total Lunas" value={data?.summary.paidTotal ?? 0} money loading={!data} />
      </div>
      <TableCard
        toolbar={
          <Flex vertical gap={8} className="w-full">
            <Flex justify="space-between" align="center" wrap gap={8}>
              <Typography.Text strong>Status Order</Typography.Text>
              <Flex gap={8}>
                <ExportButton
                  loading={exportReport.isPending}
                  onExport={(format) =>
                    exportReport.mutate({
                      format,
                      target: { kind: ReportKind.Orders, filter: { from: params.from, to: params.to, status: params.status, paymentStatus: params.paymentStatus } },
                    })
                  }
                />
                <ViewModeToggle value={view} onChange={setView} />
              </Flex>
            </Flex>
            <EnumCheckboxGroup meta={ORDER_STATUS_META} value={params.status} onChange={(status) => setFilter({ status })} />
            <Typography.Text strong>Pembayaran</Typography.Text>
            <EnumCheckboxGroup
              meta={PAYMENT_STATUS_META}
              value={params.paymentStatus}
              onChange={(paymentStatus) => setFilter({ paymentStatus })}
            />
          </Flex>
        }
      >
        <DataView<ReportOrder>
          view={view}
          loading={isFetching}
          dataSource={data?.items}
          pagination={pagination(data?.total)}
          renderItem={(order) => <ReportOrderCard order={order} />}
          columns={[
            {
              title: "No. Order",
              dataIndex: "orderNo",
              render: (orderNo: string, order) => (
                <Link href={buildUrl(AppRoute.OrderDetail, { id: order.id })}>{orderNo}</Link>
              ),
            },
            { title: "Tanggal", dataIndex: "createdAt", render: formatDateTime },
            { title: "Customer", key: "customer", render: (_, order) => order.customer.name },
            { title: "Plat Nomor", key: "plat", render: (_, order) => order.customerVehicle.platNomor },
            {
              title: "Status",
              dataIndex: "status",
              render: (status: ReportOrder["status"]) => <StatusTag value={status} meta={ORDER_STATUS_META} />,
            },
            {
              title: "Pembayaran",
              dataIndex: "paymentStatus",
              render: (status: ReportOrder["paymentStatus"]) => <StatusTag value={status} meta={PAYMENT_STATUS_META} />,
            },
            {
              title: "Total",
              dataIndex: "totalPrice",
              align: "right",
              render: (value: number) => <Money value={value} strong />,
            },
          ]}
        />
      </TableCard>
    </Flex>
  );
}
