"use client";

import Link from "next/link";
import { Card, Flex, Typography } from "antd";
import { Money } from "@/components/atoms/money";
import { StatusTag } from "@/components/atoms/status-tag";
import { VehicleLabel } from "@/components/atoms/vehicle-label";
import { ORDER_STATUS_META } from "@/constants/order-status";
import { PAYMENT_STATUS_META } from "@/constants/payment";
import { AppRoute } from "@/constants/routes";
import type { Order } from "@/types/order";
import { formatDateTime } from "@/utils/format";
import { buildUrl } from "@/utils/url";

interface OrderCardProps {
  order: Order;
  /** Sembunyikan info customer (misal di halaman detail customer). */
  hideCustomer?: boolean;
}

/** Ringkasan satu order dalam bentuk card; seluruh card menuju detail order. */
export function OrderCard({ order, hideCustomer }: OrderCardProps) {
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
          {!hideCustomer && (
            <div>
              <div>{order.customer.name}</div>
              <Typography.Text type="secondary">{order.customer.phoneNumber}</Typography.Text>
            </div>
          )}
          <VehicleLabel vehicle={order.customerVehicle} />
          <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }} className="mb-0">
            {order.complaint}
          </Typography.Paragraph>
          <Flex justify="space-between" align="center">
            <StatusTag value={order.paymentStatus} meta={PAYMENT_STATUS_META} />
            <Money value={order.totalPrice} strong />
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
