"use client";

import Link from "next/link";
import { DollarOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Descriptions, Flex } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { ITEM_EDITABLE_STATUSES, ORDER_STATUS_META, OrderStatus } from "@/constants/order-status";
import { PAYMENT_METHOD_META, PAYMENT_STATUS_META, PaymentStatus } from "@/constants/payment";
import { AppRoute } from "@/constants/routes";
import { useOrder } from "@/hooks/queries/use-orders";
import { useModalState } from "@/hooks/use-modal-state";
import type { OrderDetail as OrderDetailData } from "@/types/order";
import { formatDateTime, formatMileage } from "@/utils/format";
import { formatNextService, getStockShortages } from "@/utils/order";
import { buildUrl } from "@/utils/url";
import { OrderEditModal } from "./order-edit-modal";
import { OrderStatusActions } from "./order-status-actions";
import { PaymentModal } from "./payment-modal";
import { ServiceFeeTable } from "./service-fee-table";

export function OrderDetail({ id }: { id: string }) {
  const query = useOrder(id);
  return <QueryState {...query}>{(order) => <OrderDetailView order={order} />}</QueryState>;
}

function OrderDetailView({ order }: { order: OrderDetailData }) {
  const editModal = useModalState();
  const paymentModal = useModalState();
  const editable = ITEM_EDITABLE_STATUSES.includes(order.status);
  const canPay = order.status === OrderStatus.done && order.paymentStatus === PaymentStatus.unpaid;
  const shortages = order.status === OrderStatus.draft ? getStockShortages(order.serviceFees) : [];

  return (
    <>
      <PageHeader
        title={order.orderNo}
        backHref={AppRoute.Orders}
        subtitle={
          <Flex gap={4} className="mt-1">
            <StatusTag value={order.status} meta={ORDER_STATUS_META} />
            <StatusTag value={order.paymentStatus} meta={PAYMENT_STATUS_META} />
          </Flex>
        }
        extra={
          <>
            <OrderStatusActions order={order} shortageCount={shortages.length} />
            {canPay && (
              <Button size="large" type="primary" icon={<DollarOutlined />} onClick={() => paymentModal.show()}>
                Catat Pembayaran
              </Button>
            )}
            <Link href={buildUrl(AppRoute.OrderInvoice, { id: order.id })} target="_blank">
              <Button size="large" icon={<PrinterOutlined />}>Nota</Button>
            </Link>
          </>
        }
      />

      <Flex vertical gap={16}>
        {order.status === OrderStatus.cancelled && (
          <Alert type="error" showIcon title="Order dibatalkan" description={order.cancelReason} />
        )}
        {shortages.length > 0 && (
          <Alert
            type="warning"
            showIcon
            title="Stok tidak cukup — order belum bisa di-booked"
            description={shortages.map((s) => `${s.name}: butuh ${s.required}, tersedia ${s.available}`).join(" · ")}
          />
        )}

        <Card
          title="Informasi Order"
          extra={
            editable && (
              <Button icon={<EditOutlined />} onClick={() => editModal.show()}>
                Ubah Detail
              </Button>
            )
          }
        >
          <Descriptions
            column={{ xs: 1, md: 2 }}
            items={[
              {
                label: "Customer",
                children: (
                  <Link href={buildUrl(AppRoute.CustomerDetail, { id: order.customer.id })}>
                    {order.customer.name} ({order.customer.phoneNumber})
                  </Link>
                ),
              },
              {
                label: "Kendaraan",
                children: `${order.customerVehicle.platNomor} · ${order.customerVehicle.brand.name} ${order.customerVehicle.brand.type}`,
              },
              { label: "Kilometer", children: formatMileage(order.mileage) },
              { label: "Mekanik", children: order.mechanic?.name ?? "Belum ditugaskan" },
              { label: "Keluhan", children: order.complaint, span: 2 },
              { label: "Catatan mekanik", children: order.mechanicNote ?? "-", span: 2 },
              { label: "Catatan bengkel", children: order.notes ?? "-", span: 2 },
              { label: "Service selanjutnya", children: formatNextService(order), span: 2 },
              { label: "Draft", children: formatDateTime(order.draftAt) },
              { label: "Booked", children: formatDateTime(order.bookedAt) },
              { label: "Mulai dikerjakan", children: formatDateTime(order.progressAt) },
              { label: "Selesai", children: formatDateTime(order.doneAt) },
              ...(order.cancelledAt ? [{ label: "Dibatalkan", children: formatDateTime(order.cancelledAt) }] : []),
              {
                label: "Pembayaran",
                children: order.paymentMethod
                  ? `${PAYMENT_METHOD_META[order.paymentMethod].label} · ${formatDateTime(order.paidAt)}`
                  : "-",
              },
            ]}
          />
        </Card>

        <ServiceFeeTable order={order} />
      </Flex>

      {editModal.render(<OrderEditModal order={order} onClose={editModal.close} />)}
      {paymentModal.render(<PaymentModal order={order} onClose={paymentModal.close} />)}
    </>
  );
}
