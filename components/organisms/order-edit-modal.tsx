"use client";

import { FormProvider } from "react-hook-form";
import { FormModal } from "@/components/molecules/form-modal";
import { useUpdateOrder } from "@/hooks/queries/use-orders";
import { useZodForm } from "@/hooks/use-zod-form";
import { orderSchema } from "@/schemas/order.schema";
import type { Order } from "@/types/order";
import { toDateOnly } from "@/utils/format";
import { OrderFields } from "./order-fields";

const MODAL_WIDTH = 720;

export function OrderEditModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const save = useUpdateOrder(order.id, onClose);
  const form = useZodForm(orderSchema, {
    complaint: order.complaint,
    notes: order.notes ?? "",
    mileage: order.mileage ?? undefined,
    mechanicId: order.mechanicId,
    mechanicNote: order.mechanicNote,
    nextServiceDate: toDateOnly(order.nextServiceDate),
    nextServiceNote: order.nextServiceNote,
  });

  return (
    <FormModal
      title="Ubah Detail Service"
      width={MODAL_WIDTH}
      onSubmit={form.handleSubmit((values) => save.mutate(values))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <FormProvider {...form}>
        <OrderFields />
      </FormProvider>
    </FormModal>
  );
}
