"use client";

import { Steps } from "antd";
import {
  ORDER_STATUS_TIMESTAMP_FIELD,
  OrderStatus,
  QUEUE_PROGRESS_STEPS,
  QUEUE_STATUS_META,
} from "@/constants/order-status";
import type { QueueOrder } from "@/types/queue";
import { formatDateTime } from "@/utils/format";

/** Tahapan pengerjaan order (Menunggu Konfirmasi → Dalam Antrean → Dikerjakan → Selesai). */
export function QueueProgress({ order }: { order: QueueOrder }) {
  const cancelled = order.status === OrderStatus.cancelled;
  // Saat dibatalkan, tahap error ditaruh setelah tahap terakhir yang sempat dicapai.
  const reachedCount = QUEUE_PROGRESS_STEPS.filter((status) => order[ORDER_STATUS_TIMESTAMP_FIELD[status]]).length;
  const current = cancelled ? reachedCount : QUEUE_PROGRESS_STEPS.indexOf(order.status);
  const isCancelledStep = (index: number) => cancelled && index === current;

  return (
    <Steps
      orientation="vertical"
      size="small"
      current={current}
      status={cancelled ? "error" : order.status === OrderStatus.done ? "finish" : "process"}
      items={QUEUE_PROGRESS_STEPS.map((status, index) => ({
        title: QUEUE_STATUS_META[isCancelledStep(index) ? OrderStatus.cancelled : status].label,
        content: formatDateTime(isCancelledStep(index) ? order.cancelledAt : order[ORDER_STATUS_TIMESTAMP_FIELD[status]]),
      }))}
    />
  );
}
