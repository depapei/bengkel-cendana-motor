"use client";

import Link from "next/link";
import { Card, Flex, Typography } from "antd";
import { Money } from "@/components/atoms/money";
import { StatusTag } from "@/components/atoms/status-tag";
import { ORDER_STATUS_META } from "@/constants/order-status";
import { PAYMENT_STATUS_META } from "@/constants/payment";
import { AppRoute } from "@/constants/routes";
import type { ReportOrder } from "@/types/report";
import { formatDateTime } from "@/utils/format";
import { buildUrl } from "@/utils/url";

/** Satu baris laporan order dalam bentuk card. */
export function ReportOrderCard({ order }: { order: ReportOrder }) {
  return (
    <Link href={buildUrl(AppRoute.OrderDetail, { id: order.id })} className="block h-full">
      <Card
        hoverable
        className="h-full"
        title={order.orderNo}
        extra={<StatusTag value={order.status} meta={ORDER_STATUS_META} />}
      >
        <Flex vertical gap={8}>
          <Typography.Text type="secondary">{formatDateTime(order.createdAt)}</Typography.Text>
          <div>
            <div>{order.customer.name}</div>
            <Typography.Text type="secondary">{order.customerVehicle.platNomor}</Typography.Text>
          </div>
          <Flex justify="space-between" align="center">
            <StatusTag value={order.paymentStatus} meta={PAYMENT_STATUS_META} />
            <Money value={order.totalPrice} strong />
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
