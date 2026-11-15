"use client";

import { Input } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { useUpdateOrder } from "@/hooks/queries/use-orders";
import { useZodForm } from "@/hooks/use-zod-form";
import { orderSchema } from "@/schemas/order.schema";
import type { Order } from "@/types/order";

export function OrderEditModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const save = useUpdateOrder(order.id, onClose);
  const { control, handleSubmit } = useZodForm(orderSchema, { complaint: order.complaint, notes: order.notes ?? "" });

  return (
    <FormModal title="Ubah Keluhan & Catatan" onSubmit={handleSubmit((values) => save.mutate(values))} onCancel={onClose} loading={save.isPending}>
      <FormField control={control} name="complaint" label="Keluhan" required render={(field) => <Input.TextArea {...field} rows={3} />} />
      <FormField
        control={control}
        name="notes"
        label="Catatan bengkel"
        render={(field) => <Input.TextArea {...field} value={field.value ?? ""} rows={2} />}
      />
    </FormModal>
  );
}
