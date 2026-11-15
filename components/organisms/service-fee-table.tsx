"use client";

import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Typography } from "antd";
import { Money } from "@/components/atoms/money";
import { StockBadge } from "@/components/atoms/stock-badge";
import { ConfirmButton } from "@/components/molecules/confirm-button";
import { DataTable } from "@/components/molecules/data-table";
import { ITEM_EDITABLE_STATUSES, OrderStatus } from "@/constants/order-status";
import { useRemoveOrderItem } from "@/hooks/queries/use-orders";
import { useModalState } from "@/hooks/use-modal-state";
import type { OrderDetail, ServiceFee } from "@/types/order";
import { ServiceFeeFormModal } from "./service-fee-form-modal";

/** Rincian servis (jasa saja / sparepart + jasa). */
export function ServiceFeeTable({ order }: { order: OrderDetail }) {
  const modal = useModalState<ServiceFee>();
  const remove = useRemoveOrderItem(order.id);
  const editable = ITEM_EDITABLE_STATUSES.includes(order.status);
  const showStock = order.status === OrderStatus.draft;

  return (
    <Card
      title="Rincian Servis"
      extra={
        editable && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => modal.show()}>
            Tambah Item
          </Button>
        )
      }
    >
      <DataTable<ServiceFee>
        dataSource={order.serviceFees}
        pagination={false}
        columns={[
          {
            title: "Pekerjaan",
            dataIndex: "name",
            render: (name: string, item) => (
              <div>
                <div>{name}</div>
                <Typography.Text type="secondary">
                  {item.sparePart ? `Sparepart: ${item.sparePart.name}` : "Jasa saja"}
                </Typography.Text>
              </div>
            ),
          },
          { title: "Qty", dataIndex: "qty", align: "right" },
          ...(showStock
            ? [
                {
                  title: "Stok",
                  key: "stock",
                  align: "right" as const,
                  render: (_: unknown, item: ServiceFee) =>
                    item.sparePart ? <StockBadge stock={item.sparePart.stock} required={item.qty} /> : "-",
                },
              ]
            : []),
          { title: "Harga Sparepart", dataIndex: "sparepartPrice", align: "right", render: (v: number) => <Money value={v} /> },
          { title: "Jasa", dataIndex: "laborPrice", align: "right", render: (v: number) => <Money value={v} /> },
          { title: "Subtotal", dataIndex: "subtotal", align: "right", render: (v: number) => <Money value={v} strong /> },
          ...(editable
            ? [
                {
                  title: "Aksi",
                  key: "actions",
                  width: 120,
                  render: (_: unknown, item: ServiceFee) => (
                    <Space>
                      <Button icon={<EditOutlined />} onClick={() => modal.show(item)} />
                      <ConfirmButton confirmTitle="Hapus item ini?" onConfirm={() => remove.mutate(item.id)} />
                    </Space>
                  ),
                },
              ]
            : []),
        ]}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={showStock ? 5 : 4}>
              <Typography.Text strong>Total</Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Money value={order.totalPrice} strong />
            </Table.Summary.Cell>
            {editable && <Table.Summary.Cell index={2} />}
          </Table.Summary.Row>
        )}
      />
      {modal.open && <ServiceFeeFormModal order={order} record={modal.record} onClose={modal.close} />}
    </Card>
  );
}
