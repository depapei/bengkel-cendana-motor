"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { AuditOutlined, EditOutlined, ImportOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Space } from "antd";
import { Money } from "@/components/atoms/money";
import { QtyDelta } from "@/components/atoms/qty-delta";
import { StatusTag } from "@/components/atoms/status-tag";
import { StockBadge } from "@/components/atoms/stock-badge";
import { ConfirmButton } from "@/components/molecules/confirm-button";
import { DataTable } from "@/components/molecules/data-table";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { AppRoute } from "@/constants/routes";
import { STOCK_MOVEMENT_TYPE_META, StockMovementType } from "@/constants/stock-movement";
import { useDeleteSparePart, useSparePart, useStockMovements } from "@/hooks/queries/use-spare-parts";
import { useListParams } from "@/hooks/use-list-params";
import { useModalState } from "@/hooks/use-modal-state";
import type { SparePart, StockMovement } from "@/types/models";
import { formatDateTime } from "@/utils/format";
import { buildUrl } from "@/utils/url";
import { SparePartFormModal } from "./spare-part-form-modal";
import { StockMovementFormModal } from "./stock-movement-form-modal";

type ManualMovement = typeof StockMovementType.in | typeof StockMovementType.adjust;

export function SparePartDetail({ id }: { id: string }) {
  const query = useSparePart(id);
  return <QueryState {...query}>{(part) => <SparePartDetailView part={part} />}</QueryState>;
}

function SparePartDetailView({ part }: { part: SparePart }) {
  const router = useRouter();
  const remove = useDeleteSparePart(() => router.replace(AppRoute.SpareParts));
  const editModal = useModalState();
  const movementModal = useModalState<ManualMovement>();

  return (
    <>
      <PageHeader
        title={part.name}
        backHref={AppRoute.SpareParts}
        subtitle="Detail & riwayat pergerakan stok"
        extra={
          <>
            <Button type="primary" icon={<ImportOutlined />} onClick={() => movementModal.show(StockMovementType.in)}>
              Barang Masuk
            </Button>
            <Button icon={<AuditOutlined />} onClick={() => movementModal.show(StockMovementType.adjust)}>
              Stock Opname
            </Button>
            <Button icon={<EditOutlined />} onClick={() => editModal.show()}>
              Ubah
            </Button>
            <ConfirmButton confirmTitle="Hapus sparepart ini?" onConfirm={() => remove.mutate(part.id)}>
              Hapus
            </ConfirmButton>
          </>
        }
      />

      <Space orientation="vertical" size="large" className="w-full">
        <Card>
          <Descriptions
            column={{ xs: 1, sm: 3 }}
            items={[
              { label: "Harga jual", children: <Money value={part.price} strong /> },
              { label: "Stok tersedia", children: <StockBadge stock={part.stock} /> },
              { label: "Terakhir diubah", children: formatDateTime(part.updatedAt) },
            ]}
          />
        </Card>
        <Card title="Riwayat Pergerakan Stok">
          <StockMovementTable sparepartId={part.id} />
        </Card>
      </Space>

      {editModal.open && <SparePartFormModal record={part} onClose={editModal.close} />}
      {movementModal.open && movementModal.record && (
        <StockMovementFormModal part={part} type={movementModal.record} onClose={movementModal.close} />
      )}
    </>
  );
}

function StockMovementTable({ sparepartId }: { sparepartId: string }) {
  const { params, pagination } = useListParams();
  const { data, isFetching } = useStockMovements(sparepartId, params);

  return (
    <DataTable<StockMovement>
      loading={isFetching}
      dataSource={data?.items}
      pagination={pagination(data?.total)}
      columns={[
        { title: "Waktu", dataIndex: "createdAt", render: formatDateTime },
        {
          title: "Jenis",
          dataIndex: "type",
          render: (type: StockMovement["type"]) => <StatusTag value={type} meta={STOCK_MOVEMENT_TYPE_META} />,
        },
        {
          title: "Qty",
          dataIndex: "qty",
          align: "right",
          render: (qty: number) => <QtyDelta qty={qty} />,
        },
        {
          title: "Order",
          dataIndex: "order",
          render: (order: StockMovement["order"]) =>
            order ? <Link href={buildUrl(AppRoute.OrderDetail, { id: order.id })}>{order.orderNo}</Link> : "-",
        },
        { title: "Catatan", dataIndex: "note", render: (note: string | null) => note ?? "-" },
      ]}
    />
  );
}
