"use client";

import { Alert } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { DataGrid } from "@/components/molecules/data-grid";
import { PageHeader } from "@/components/molecules/page-header";
import { QueueCard } from "@/components/molecules/queue-card";
import { SearchInput } from "@/components/molecules/search-input";
import { StatCard } from "@/components/molecules/stat-card";
import { TableCard } from "@/components/molecules/table-card";
import { QUEUE_REFRESH_INTERVAL_MS } from "@/constants/app";
import { OrderStatus, QUEUE_STATUS_META } from "@/constants/order-status";
import { useQueue } from "@/hooks/queries/use-queue";
import { useListParams } from "@/hooks/use-list-params";
import { useModalState } from "@/hooks/use-modal-state";
import type { QueueOrder } from "@/types/queue";
import { getErrorMessage } from "@/utils/error";
import { formatDate } from "@/utils/format";
import { QueueDetailModal } from "./queue-detail-modal";

const MS_PER_SECOND = 1000;

/** Papan antrean servis hari ini untuk customer (tanpa data harga). */
export function QueueBoard() {
  const { params, setFilter, pagination } = useListParams();
  const { data, isFetching, isLoading, error } = useQueue(params);
  const detail = useModalState<string>();

  return (
    <>
      <PageHeader
        title="Antrean Servis Hari Ini"
        subtitle={`${data ? `${formatDate(data.date)} · ` : ""}Diperbarui otomatis setiap ${QUEUE_REFRESH_INTERVAL_MS / MS_PER_SECOND} detik`}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Object.values(OrderStatus).map((status) => (
          <StatCard
            key={status}
            title={<StatusTag value={status} meta={QUEUE_STATUS_META} />}
            value={data?.statusCounts[status] ?? 0}
            loading={isLoading}
          />
        ))}
      </div>

      {error && <Alert type="error" showIcon title={getErrorMessage(error)} />}

      <TableCard toolbar={<SearchInput placeholder="Cari nama, motor, plat nomor" onSearch={(q) => setFilter({ q })} />}>
        <DataGrid<QueueOrder>
          dataSource={data?.items}
          loading={isFetching}
          pagination={pagination(data?.total)}
          renderItem={(order) => <QueueCard order={order} onClick={() => detail.show(order.id)} />}
        />
      </TableCard>

      {detail.render(detail.record && <QueueDetailModal id={detail.record} onClose={detail.close} />)}
    </>
  );
}
