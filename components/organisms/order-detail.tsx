"use client";

import Link from "next/link";
import { DollarOutlined, PrinterOutlined } from "@ant-design/icons";
import { Alert, Button, Flex } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { ORDER_STATUS_META, OrderStatus } from "@/constants/order-status";
import { PAYMENT_STATUS_META, PaymentStatus } from "@/constants/payment";
import { AppRoute } from "@/constants/routes";
import { useOrder } from "@/hooks/queries/use-orders";
import { useModalState } from "@/hooks/use-modal-state";
import type { OrderDetail as OrderDetailData } from "@/types/order";
import { getStockShortages } from "@/utils/order";
import { buildUrl } from "@/utils/url";
import { OrderInfoCard } from "./order-info-card";
import { OrderStatusActions } from "./order-status-actions";
import { PaymentModal } from "./payment-modal";
import { ServiceFeeTable } from "./service-fee-table";

export function OrderDetail({ id }: { id: string }) {
  const query = useOrder(id);
  return <QueryState {...query}>{(order) => <OrderDetailView order={order} />}</QueryState>;
}

function OrderDetailView({ order }: { order: OrderDetailData }) {
  const paymentModal = useModalState();
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

        <OrderInfoCard order={order} />

        <ServiceFeeTable order={order} />
      </Flex>

      {paymentModal.render(<PaymentModal order={order} onClose={paymentModal.close} />)}
    </>
  );
}
