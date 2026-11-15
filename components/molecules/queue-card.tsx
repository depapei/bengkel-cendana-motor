"use client";

import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Flex, Typography } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { VehicleLabel } from "@/components/atoms/vehicle-label";
import { QUEUE_STATUS_META } from "@/constants/order-status";
import type { QueueOrder } from "@/types/queue";
import { formatDateTime } from "@/utils/format";
import { queueNumber } from "@/utils/order";

interface QueueCardProps {
  order: QueueOrder;
  onClick: () => void;
}

/** Satu order di papan antrean customer — tanpa harga. */
export function QueueCard({ order, onClick }: QueueCardProps) {
  return (
    <Card hoverable size="small" className="h-full" onClick={onClick}>
      <Flex vertical gap={8}>
        <Flex justify="space-between" align="flex-start" gap={8}>
          <div>
            <Typography.Text type="secondary" className="text-xs">
              No. Antrean
            </Typography.Text>
            <div className="text-3xl leading-none font-bold">{queueNumber(order.orderNo)}</div>
          </div>
          <StatusTag value={order.status} meta={QUEUE_STATUS_META} />
        </Flex>
        <Typography.Text strong>{order.customer.name}</Typography.Text>
        <VehicleLabel vehicle={order.customerVehicle} />
        <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }} className="mb-0">
          {order.complaint}
        </Typography.Paragraph>
        <Flex justify="space-between" wrap gap={8}>
          <Typography.Text type="secondary" className="text-xs">
            <UserOutlined /> {order.mechanic?.name ?? "Belum ada mekanik"}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-xs">
            <ClockCircleOutlined /> {formatDateTime(order.createdAt)}
          </Typography.Text>
        </Flex>
      </Flex>
    </Card>
  );
}
