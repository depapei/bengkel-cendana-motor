"use client";

import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { VehicleLabel } from "@/components/atoms/vehicle-label";
import { ListCard } from "@/components/molecules/list-card";
import { QUEUE_STATUS_META } from "@/constants/order-status";
import type { QueueOrder } from "@/types/queue";
import { formatDateTime } from "@/utils/format";
import { queueNumber } from "@/utils/order";

interface QueueCardProps {
  order: QueueOrder;
  onClick: () => void;
}

/** Satu order di papan antrean customer — tanpa harga. Teks lebih besar di desktop agar terbaca dari jauh. */
export function QueueCard({ order, onClick }: QueueCardProps) {
  return (
    <ListCard
      onClick={onClick}
      title={
        <div className="font-normal">
          <Typography.Text type="secondary">No. Antrean</Typography.Text>
          <div className="text-2xl leading-none font-bold lg:text-3xl">{queueNumber(order.orderNo)}</div>
        </div>
      }
      extra={<StatusTag value={order.status} meta={QUEUE_STATUS_META} />}
      footer={
        <Flex justify="space-between" wrap gap={4} className="lg:text-base">
          <Typography.Text type="secondary">
            <UserOutlined /> {order.mechanic?.name ?? "Belum ada mekanik"}
          </Typography.Text>
          <Typography.Text type="secondary">
            <ClockCircleOutlined /> {formatDateTime(order.createdAt)}
          </Typography.Text>
        </Flex>
      }
    >
      <Typography.Text strong className="lg:text-base">
        {order.customer.name}
      </Typography.Text>
      <VehicleLabel vehicle={order.customerVehicle} />
      <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }} className="mb-0">
        {order.complaint}
      </Typography.Paragraph>
    </ListCard>
  );
}
