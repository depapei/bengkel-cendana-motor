"use client";

import { Flex, Typography } from "antd";
import { Money } from "@/components/atoms/money";
import { StatusTag } from "@/components/atoms/status-tag";
import { ListCard } from "@/components/molecules/list-card";
import { ORDER_STATUS_META } from "@/constants/order-status";
import { PAYMENT_STATUS_META } from "@/constants/payment";
import { AppRoute } from "@/constants/routes";
import type { ReportOrder } from "@/types/report";
import { formatDateTime } from "@/utils/format";
import { calcProfit } from "@/utils/order";
import { buildUrl } from "@/utils/url";

/** Satu baris laporan order dalam bentuk card. */
export function ReportOrderCard({ order }: { order: ReportOrder }) {
  return (
    <ListCard
      href={buildUrl(AppRoute.OrderDetail, { id: order.id })}
      title={order.orderNo}
      extra={<StatusTag value={order.status} meta={ORDER_STATUS_META} />}
      footer={
        <Flex justify="space-between" align="center" wrap gap={4}>
          <StatusTag value={order.paymentStatus} meta={PAYMENT_STATUS_META} />
          <Money value={order.totalPrice} strong />
        </Flex>
      }
    >
      <Typography.Text type="secondary">{formatDateTime(order.createdAt)}</Typography.Text>
      <div>
        <div>{order.customer.name}</div>
        <Typography.Text type="secondary">{order.customerVehicle.platNomor}</Typography.Text>
      </div>
      <Flex justify="space-between" wrap gap={4}>
        <Typography.Text type="secondary">Laba</Typography.Text>
        <Money value={calcProfit(order.totalPrice, order.totalCost)} emptyText="-" />
      </Flex>
    </ListCard>
  );
}
