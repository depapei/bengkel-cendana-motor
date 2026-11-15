"use client";

import { Input, InputNumber } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { STOCK_MOVEMENT_TYPE_META, StockMovementType } from "@/constants/stock-movement";
import { useAddStockMovement } from "@/hooks/queries/use-spare-parts";
import { useZodForm } from "@/hooks/use-zod-form";
import { stockMovementSchema } from "@/schemas/spare-part.schema";
import type { SparePart } from "@/types/models";

interface StockMovementFormModalProps {
  part: SparePart;
  type: typeof StockMovementType.in | typeof StockMovementType.adjust;
  onClose: () => void;
}

export function StockMovementFormModal({ part, type, onClose }: StockMovementFormModalProps) {
  const isAdjust = type === StockMovementType.adjust;
  const save = useAddStockMovement(part.id, onClose);
  const { control, handleSubmit } = useZodForm(stockMovementSchema, {
    type,
    qty: isAdjust ? part.stock : 1,
    note: "",
  });

  return (
    <FormModal
      title={`${STOCK_MOVEMENT_TYPE_META[type].label} — ${part.name}`}
      onSubmit={handleSubmit((values) => save.mutate(values))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <FormField
        control={control}
        name="qty"
        label={isAdjust ? "Stok fisik hasil hitung" : "Jumlah masuk"}
        extra={`Stok sistem saat ini: ${part.stock}`}
        required
        render={(field) => <InputNumber {...field} min={isAdjust ? 0 : 1} className="w-full" />}
      />
      <FormField
        control={control}
        name="note"
        label="Catatan"
        render={(field) => (
          <Input.TextArea
            {...field}
            value={field.value ?? ""}
            rows={2}
            placeholder={isAdjust ? "Contoh: stock opname bulanan" : "Contoh: supplier / no. faktur"}
          />
        )}
      />
    </FormModal>
  );
}
