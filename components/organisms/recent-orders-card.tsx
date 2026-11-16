"use client";

import Link from "next/link";
import { Card, Empty, Flex, Skeleton, Typography } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { RECENT_ORDERS_LIMIT } from "@/constants/app";
import { ORDER_STATUS_META } from "@/constants/order-status";
import { AppRoute } from "@/constants/routes";
import { useOrders } from "@/hooks/queries/use-orders";
import { formatDateTime } from "@/utils/format";
import { buildUrl } from "@/utils/url";

/** Order terbaru di dashboard; tiap baris menuju detail order. */
export function RecentOrdersCard() {
  const { data, isLoading } = useOrders({ page: 1, pageSize: RECENT_ORDERS_LIMIT });
  const orders = data?.items ?? [];

  return (
    <Card title="Order Terbaru" extra={<Link href={AppRoute.Orders}>Lihat semua</Link>} className="h-full">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: RECENT_ORDERS_LIMIT - 1 }} />
      ) : orders.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Belum ada order" />
      ) : (
        <Flex vertical gap={4}>
          {orders.map((order) => (
            <Link
              key={order.id}
              href={buildUrl(AppRoute.OrderDetail, { id: order.id })}
              className="-mx-3 flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-inherit transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <div className="min-w-0">
                <Typography.Text strong>{order.orderNo}</Typography.Text>
                <Typography.Text> · {order.customer.name}</Typography.Text>
                <div>
                  <Typography.Text type="secondary" ellipsis>
                    {order.customerVehicle.platNomor} · {order.customerVehicle.brand.name} {order.customerVehicle.brand.type} ·{" "}
                    {formatDateTime(order.createdAt)}
                  </Typography.Text>
                </div>
              </div>
              <StatusTag value={order.status} meta={ORDER_STATUS_META} />
            </Link>
          ))}
        </Flex>
      )}
    </Card>
  );
}
