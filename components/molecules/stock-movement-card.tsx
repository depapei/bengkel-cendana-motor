"use client";

import Link from "next/link";
import { Card, Flex, Typography } from "antd";
import { QtyDelta } from "@/components/atoms/qty-delta";
import { StatusTag } from "@/components/atoms/status-tag";
import { AppRoute } from "@/constants/routes";
import { STOCK_MOVEMENT_TYPE_META } from "@/constants/stock-movement";
import type { ReportStockMovement } from "@/types/report";
import { formatDateTime } from "@/utils/format";
import { buildUrl } from "@/utils/url";

/** Satu pergerakan stok dalam bentuk card. */
export function StockMovementCard({ movement }: { movement: ReportStockMovement }) {
  return (
    <Card
      className="h-full"
      title={
        <Link href={buildUrl(AppRoute.SparePartDetail, { id: movement.sparePart.id })}>{movement.sparePart.name}</Link>
      }
      extra={<StatusTag value={movement.type} meta={STOCK_MOVEMENT_TYPE_META} />}
    >
      <Flex vertical gap={8}>
        <Flex justify="space-between" align="center">
          <Typography.Text type="secondary">{formatDateTime(movement.createdAt)}</Typography.Text>
          <QtyDelta qty={movement.qty} />
        </Flex>
        {movement.order && (
          <Link href={buildUrl(AppRoute.OrderDetail, { id: movement.order.id })}>{movement.order.orderNo}</Link>
        )}
        {movement.note && <Typography.Text type="secondary">{movement.note}</Typography.Text>}
      </Flex>
    </Card>
  );
}
