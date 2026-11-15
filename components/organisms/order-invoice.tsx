"use client";

import { PrinterOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { Button, Descriptions, Divider, Flex, Table, Typography } from "antd";
import { BackButton } from "@/components/atoms/back-button";
import { Money } from "@/components/atoms/money";
import { StatusTag } from "@/components/atoms/status-tag";
import { QueryState } from "@/components/molecules/query-state";
import { APP_NAME } from "@/constants/app";
import { PAYMENT_METHOD_META, PAYMENT_STATUS_META } from "@/constants/payment";
import { AppRoute } from "@/constants/routes";
import { useOrder } from "@/hooks/queries/use-orders";
import type { OrderDetail, ServiceFee } from "@/types/order";
import { formatDateTime, formatMileage } from "@/utils/format";
import { formatNextService } from "@/utils/order";
import { buildUrl } from "@/utils/url";
import { buildInvoiceMessage, buildWhatsAppLink } from "@/utils/whatsapp";

/** Nota servis: cetak atau kirim lewat WhatsApp. */
export function OrderInvoice({ id }: { id: string }) {
  const query = useOrder(id);
  return <QueryState {...query}>{(order) => <InvoiceView order={order} />}</QueryState>;
}

function InvoiceView({ order }: { order: OrderDetail }) {
  return (
    <>
      {/* Tombol aksi tidak ikut tercetak. */}
      <div className="mb-8 flex gap-2 print:hidden">
        <BackButton href={buildUrl(AppRoute.OrderDetail, { id: order.id })} />
        <Button
          className="ml-auto"
          icon={<WhatsAppOutlined />}
          href={buildWhatsAppLink(order.customer.phoneNumber, buildInvoiceMessage(order))}
          target="_blank"
        >
          Kirim WhatsApp
        </Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
          Cetak
        </Button>
      </div>

      <Flex justify="space-between" align="flex-start">
        <div>
          <Typography.Title level={3} className="mb-0">
            {APP_NAME}
          </Typography.Title>
          <Typography.Text type="secondary">Nota Servis</Typography.Text>
        </div>
        <div className="text-right">
          <Typography.Text strong>{order.orderNo}</Typography.Text>
          <div>{formatDateTime(order.createdAt)}</div>
        </div>
      </Flex>

      <Divider />

      <Descriptions
        size="small"
        column={2}
        items={[
          { label: "Customer", children: order.customer.name },
          { label: "No. HP", children: order.customer.phoneNumber },
          { label: "Plat", children: order.customerVehicle.platNomor },
          { label: "Motor", children: `${order.customerVehicle.brand.name} ${order.customerVehicle.brand.type}` },
          { label: "Kilometer", children: formatMileage(order.mileage) },
          { label: "Mekanik", children: order.mechanic?.name ?? "-" },
          { label: "Keluhan", children: order.complaint, span: 2 },
          ...(order.nextServiceDate || order.nextServiceNote
            ? [{ label: "Service selanjutnya", children: formatNextService(order), span: 2 }]
            : []),
        ]}
      />

      <Table<ServiceFee>
        className="mt-6"
        rowKey="id"
        size="small"
        pagination={false}
        dataSource={order.serviceFees}
        columns={[
          { title: "Item", dataIndex: "name" },
          { title: "Qty", dataIndex: "qty", align: "right" },
          { title: "Sparepart", dataIndex: "sparepartPrice", align: "right", render: (v: number) => <Money value={v} /> },
          { title: "Jasa", dataIndex: "laborPrice", align: "right", render: (v: number) => <Money value={v} /> },
          { title: "Subtotal", dataIndex: "subtotal", align: "right", render: (v: number) => <Money value={v} /> },
        ]}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              <Typography.Text strong>Total</Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Money value={order.totalPrice} strong />
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Flex justify="space-between" align="center" wrap gap={12} className="mt-8">
        <Flex align="center" gap={8}>
          <Typography.Text type="secondary">Status pembayaran</Typography.Text>
          <StatusTag value={order.paymentStatus} meta={PAYMENT_STATUS_META} />
          {order.paymentMethod && (
            <Typography.Text>
              {PAYMENT_METHOD_META[order.paymentMethod].label} · {formatDateTime(order.paidAt)}
            </Typography.Text>
          )}
        </Flex>
        <Typography.Text type="secondary">Terima kasih atas kepercayaan Anda</Typography.Text>
      </Flex>
    </>
  );
}
