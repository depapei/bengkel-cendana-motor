"use client";

import { Descriptions } from "antd";
import { Money } from "@/components/atoms/money";
import { EnumSelect } from "@/components/molecules/enum-select";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { PAYMENT_METHOD_META } from "@/constants/payment";
import { usePayOrder } from "@/hooks/queries/use-orders";
import { useZodForm } from "@/hooks/use-zod-form";
import { paymentSchema } from "@/schemas/order.schema";
import type { Order } from "@/types/order";

export function PaymentModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const pay = usePayOrder(order.id, onClose);
  const { control, handleSubmit } = useZodForm(paymentSchema, {});

  return (
    <FormModal title="Catat Pembayaran" okText="Tandai Lunas" onSubmit={handleSubmit((values) => pay.mutate(values))} onCancel={onClose} loading={pay.isPending}>
      <Descriptions
        className="mb-4"
        column={1}
        items={[
          { label: "No. Order", children: order.orderNo },
          { label: "Total tagihan", children: <Money value={order.totalPrice} strong /> },
        ]}
      />
      <FormField
        control={control}
        name="paymentMethod"
        label="Metode pembayaran"
        required
        render={(field) => <EnumSelect {...field} meta={PAYMENT_METHOD_META} placeholder="Pilih metode" />}
      />
    </FormModal>
  );
}
