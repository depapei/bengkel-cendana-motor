"use client";

import { useState } from "react";
import { Alert, Input, InputNumber, Typography } from "antd";
import { Money } from "@/components/atoms/money";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { MoneyInput } from "@/components/molecules/money-input";
import { OrderStatus } from "@/constants/order-status";
import { useSaveOrderItem } from "@/hooks/queries/use-orders";
import { useZodForm } from "@/hooks/use-zod-form";
import { serviceFeeSchema } from "@/schemas/order.schema";
import type { SparePart } from "@/types/models";
import type { OrderDetail, ServiceFee } from "@/types/order";
import { calcSubtotal } from "@/utils/order";
import { SparePartSelect } from "./spare-part-select";

interface ServiceFeeFormModalProps {
  order: OrderDetail;
  record?: ServiceFee;
  onClose: () => void;
}

type PartInfo = Pick<SparePart, "id" | "name" | "stock"> & { price: number };

export function ServiceFeeFormModal({ order, record, onClose }: ServiceFeeFormModalProps) {
  const save = useSaveOrderItem(order.id, record?.id, onClose);
  const [part, setPart] = useState<PartInfo | undefined>(
    record?.sparePart ? { ...record.sparePart, price: record.sparepartPrice } : undefined,
  );
  const { control, handleSubmit, watch, setValue, getValues } = useZodForm(serviceFeeSchema, {
    sparepartId: record?.sparepartId ?? null,
    name: record?.name ?? "",
    qty: record?.qty ?? 1,
    laborPrice: record?.laborPrice ?? 0,
  });

  const [qty = 0, laborPrice = 0] = watch(["qty", "laborPrice"]);
  const subtotal = calcSubtotal(qty, part?.price ?? 0, laborPrice);
  // Stok yang sudah dipotong untuk item ini (order booked/in-progress) ikut dihitung tersedia.
  const alreadyTaken = order.status !== OrderStatus.draft && record?.sparepartId === part?.id ? record?.qty ?? 0 : 0;
  const stockShort = part ? qty > part.stock + alreadyTaken : false;

  const handlePartSelected = (selected: SparePart | undefined) => {
    const previousName = part?.name;
    setPart(selected);
    const currentName = getValues("name");
    if (selected && (!currentName || currentName === previousName)) setValue("name", selected.name);
  };

  return (
    <FormModal
      title={record ? "Ubah Item" : "Tambah Item"}
      onSubmit={handleSubmit((values) => save.mutate(values))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <FormField
        control={control}
        name="sparepartId"
        label="Sparepart"
        extra="Kosongkan untuk pekerjaan jasa saja (contoh: setel rantai)"
        render={(field) => (
          <SparePartSelect
            {...field}
            current={record?.sparePart}
            onSelectPart={handlePartSelected}
          />
        )}
      />
      <FormField
        control={control}
        name="qty"
        label="Jumlah Sparepart"
        required
        render={(field) => <InputNumber {...field} min={1} placeholder="Jumlah" className="w-full" />}
      />
      <FormField control={control} name="name" label="Nama pekerjaan / item" required render={(field) => <Input {...field} placeholder="Contoh: ganti oli mesin" />} />
      <FormField control={control} name="laborPrice" label="Harga jasa" required render={(field) => <MoneyInput {...field} placeholder="Biaya jasa" />} />

      {stockShort && (
        <Alert
          className="mb-4"
          type={order.status === OrderStatus.draft ? "warning" : "error"}
          showIcon
          title={`Stok ${part?.name} tidak cukup (tersedia ${part?.stock})`}
          description={
            order.status === OrderStatus.draft
              ? "Item tetap boleh disimpan sebagai catatan/inden, tapi order belum bisa di-booked."
              : "Order sudah booked — item tidak bisa disimpan sampai stok mencukupi."
          }
        />
      )}

      <Typography.Paragraph className="mb-0 text-right">
        Subtotal: <Money value={subtotal} strong />
      </Typography.Paragraph>
    </FormModal>
  );
}
