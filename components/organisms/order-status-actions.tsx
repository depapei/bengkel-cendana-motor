"use client";

import { Button, Popconfirm, Tooltip } from "antd";
import {
  ORDER_STATUS_ACTION_LABEL,
  ORDER_STATUS_META,
  ORDER_STATUS_TRANSITIONS,
  OrderStatus,
} from "@/constants/order-status";
import { useChangeOrderStatus } from "@/hooks/queries/use-orders";
import { useModalState } from "@/hooks/use-modal-state";
import type { OrderDetail } from "@/types/order";
import { CancelOrderModal } from "./cancel-order-modal";

interface OrderStatusActionsProps {
  order: OrderDetail;
  shortageCount: number;
}

/** Tombol transisi status sesuai aturan (Spesifikasi §3). */
export function OrderStatusActions({ order, shortageCount }: OrderStatusActionsProps) {
  const change = useChangeOrderStatus(order.id);
  const cancelModal = useModalState();

  const bookingBlocker =
    order.serviceFees.length === 0
      ? "Tambahkan minimal 1 item terlebih dahulu"
      : shortageCount > 0
        ? "Ada item yang stoknya tidak cukup"
        : undefined;

  return (
    <>
      {ORDER_STATUS_TRANSITIONS[order.status].map((target) => {
        if (target === OrderStatus.cancelled) {
          return (
            <Button key={target} danger onClick={() => cancelModal.show()}>
              {ORDER_STATUS_ACTION_LABEL[target]}
            </Button>
          );
        }
        const blocker = target === OrderStatus.booked ? bookingBlocker : undefined;
        return (
          <Tooltip key={target} title={blocker}>
            <Popconfirm
              title={`Ubah status ke ${ORDER_STATUS_META[target].label}?`}
              description={target === OrderStatus.booked ? "Stok sparepart akan dikurangi." : undefined}
              okText="Ya"
              cancelText="Batal"
              disabled={!!blocker}
              onConfirm={() => change.mutate({ status: target })}
            >
              <Button type="primary" disabled={!!blocker} loading={change.isPending}>
                {ORDER_STATUS_ACTION_LABEL[target]}
              </Button>
            </Popconfirm>
          </Tooltip>
        );
      })}
      {cancelModal.open && <CancelOrderModal order={order} onClose={cancelModal.close} />}
    </>
  );
}
