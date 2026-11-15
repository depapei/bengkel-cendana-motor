"use client";

import Link from "next/link";
import { Card, Empty, Flex } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { StockBadge } from "@/components/atoms/stock-badge";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { StatCard } from "@/components/molecules/stat-card";
import { LOW_STOCK_THRESHOLD } from "@/constants/app";
import { ORDER_STATUS_META, OrderStatus } from "@/constants/order-status";
import { AppRoute } from "@/constants/routes";
import { useDashboardSummary } from "@/hooks/queries/use-reports";
import type { DashboardSummary } from "@/types/report";
import { buildUrl } from "@/utils/url";

export function DashboardOverview() {
  const query = useDashboardSummary();

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Ringkasan order servis dan stok sparepart" />
      <QueryState {...query}>{(summary) => <DashboardContent summary={summary} />}</QueryState>
    </>
  );
}

function DashboardContent({ summary }: { summary: DashboardSummary }) {
  const { orderStatusCounts, lowStockParts, lowStockTotal } = summary;
  const hiddenCount = lowStockTotal - lowStockParts.length;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Object.values(OrderStatus).map((status) => (
          <StatCard
            key={status}
            title={<StatusTag value={status} meta={ORDER_STATUS_META} />}
            value={orderStatusCounts[status]}
            href={AppRoute.Orders}
          />
        ))}
      </div>

      <Card
        title={`Stok Menipis (≤ ${LOW_STOCK_THRESHOLD})`}
        extra={hiddenCount > 0 && <Link href={AppRoute.SpareParts}>+{hiddenCount} lainnya</Link>}
      >
        {lowStockParts.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Semua stok aman" />
        ) : (
          <Flex vertical gap={12}>
            {lowStockParts.map((part) => (
              <Flex key={part.id} justify="space-between" align="center" gap={16}>
                <Link href={buildUrl(AppRoute.SparePartDetail, { id: part.id })}>{part.name}</Link>
                <StockBadge stock={part.stock} required={LOW_STOCK_THRESHOLD + 1} />
              </Flex>
            ))}
          </Flex>
        )}
      </Card>
    </>
  );
}
