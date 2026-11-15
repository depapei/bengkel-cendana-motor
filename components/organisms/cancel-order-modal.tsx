"use client";

import { Alert, Divider, Input, InputNumber } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { OrderStatus } from "@/constants/order-status";
import { useChangeOrderStatus } from "@/hooks/queries/use-orders";
import { useZodForm } from "@/hooks/use-zod-form";
import { orderStatusChangeSchema } from "@/schemas/order.schema";
import type { OrderDetail } from "@/types/order";

const STOCK_EFFECT_INFO: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.draft]: "Order masih draft — stok tidak berubah.",
  [OrderStatus.booked]: "Semua sparepart di order ini akan dikembalikan ke stok.",
  [OrderStatus.in_progress]: "Isi jumlah sparepart yang belum terpakai untuk dikembalikan ke stok.",
};

export function CancelOrderModal({ order, onClose }: { order: OrderDetail; onClose: () => void }) {
  const change = useChangeOrderStatus(order.id, onClose);
  const isInProgress = order.status === OrderStatus.in_progress;
  const returnableItems = isInProgress ? order.serviceFees.filter((item) => item.sparepartId) : [];

  const { control, handleSubmit } = useZodForm(orderStatusChangeSchema, {
    status: OrderStatus.cancelled,
    cancelReason: "",
    returns: returnableItems.map((item) => ({ serviceFeeId: item.id, qty: 0 })),
  });

  return (
    <FormModal
      title={`Batalkan Order ${order.orderNo}`}
      okText="Batalkan Order"
      okDanger
      onSubmit={handleSubmit((values) => change.mutate(values))}
      onCancel={onClose}
      loading={change.isPending}
    >
      <Alert className="mb-4" type="info" showIcon title={STOCK_EFFECT_INFO[order.status]} />
      <FormField
        control={control}
        name="cancelReason"
        label="Alasan pembatalan"
        required
        render={(field) => <Input.TextArea {...field} value={field.value ?? ""} rows={3} placeholder="Contoh: customer membatalkan servis" />}
      />
      {returnableItems.length > 0 && <Divider titlePlacement="start">Sparepart dikembalikan</Divider>}
      {returnableItems.map((item, index) => (
        <FormField
          key={item.id}
          control={control}
          name={`returns.${index}.qty`}
          label={`${item.name} (dipakai di order: ${item.qty})`}
          render={(field) => <InputNumber {...field} min={0} max={item.qty} placeholder="Jumlah dikembalikan" className="w-full" />}
        />
      ))}
    </FormModal>
  );
}
