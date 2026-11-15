"use client";

import Link from "next/link";
import { Typography, type TablePaginationConfig } from "antd";
import { Money } from "@/components/atoms/money";
import { StatusTag } from "@/components/atoms/status-tag";
import { VehicleLabel } from "@/components/atoms/vehicle-label";
import { DataView } from "@/components/molecules/data-view";
import { OrderCard } from "@/components/molecules/order-card";
import { ORDER_STATUS_META } from "@/constants/order-status";
import { PAYMENT_STATUS_META } from "@/constants/payment";
import { AppRoute } from "@/constants/routes";
import { ViewMode } from "@/constants/view-mode";
import { useOrders } from "@/hooks/queries/use-orders";
import type { Order, OrderListParams } from "@/types/order";
import { formatDateTime } from "@/utils/format";
import { buildUrl } from "@/utils/url";

interface OrderTableProps {
  params: OrderListParams;
  pagination: (total?: number) => TablePaginationConfig;
  /** Sembunyikan kolom customer (misal di halaman detail customer). */
  hideCustomer?: boolean;
  /** Tampilan daftar (default tabel). */
  view?: ViewMode;
}

export function OrderTable({ params, pagination, hideCustomer, view = ViewMode.Table }: OrderTableProps) {
  const { data, isFetching } = useOrders(params);

  return (
    <DataView<Order>
      view={view}
      loading={isFetching}
      dataSource={data?.items}
      pagination={pagination(data?.total)}
      renderItem={(order) => <OrderCard order={order} hideCustomer={hideCustomer} />}
      columns={[
        {
          title: "No. Order",
          dataIndex: "orderNo",
          render: (orderNo: string, order) => <Link href={buildUrl(AppRoute.OrderDetail, { id: order.id })}>{orderNo}</Link>,
        },
        { title: "Tanggal", dataIndex: "createdAt", render: formatDateTime },
        ...(hideCustomer
          ? []
          : [
              {
                title: "Customer",
                key: "customer",
                render: (_: unknown, order: Order) => (
                  <div>
                    <div>{order.customer.name}</div>
                    <Typography.Text type="secondary">{order.customer.phoneNumber}</Typography.Text>
                  </div>
                ),
              },
            ]),
        {
          title: "Kendaraan",
          key: "vehicle",
          render: (_, order) => <VehicleLabel vehicle={order.customerVehicle} />,
        },
        { title: "Keluhan", dataIndex: "complaint", ellipsis: true, width: 220 },
        { title: "Status", dataIndex: "status", render: (status: Order["status"]) => <StatusTag value={status} meta={ORDER_STATUS_META} /> },
        {
          title: "Pembayaran",
          dataIndex: "paymentStatus",
          render: (status: Order["paymentStatus"]) => <StatusTag value={status} meta={PAYMENT_STATUS_META} />,
        },
        { title: "Total", dataIndex: "totalPrice", align: "right", render: (value: number) => <Money value={value} strong /> },
      ]}
    />
  );
}
