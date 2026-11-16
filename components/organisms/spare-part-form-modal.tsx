"use client";

import { Input, InputNumber } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { MoneyInput } from "@/components/molecules/money-input";
import { useSaveSparePart } from "@/hooks/queries/use-spare-parts";
import { useZodForm } from "@/hooks/use-zod-form";
import { sparePartCreateSchema } from "@/schemas/spare-part.schema";
import type { SparePart } from "@/types/models";

interface SparePartFormModalProps {
  record?: SparePart;
  onClose: () => void;
}

export function SparePartFormModal({ record, onClose }: SparePartFormModalProps) {
  const save = useSaveSparePart(record?.id, onClose);
  const { control, handleSubmit } = useZodForm(sparePartCreateSchema, {
    name: record?.name ?? "",
    // Data lama tanpa harga beli → kosong, wajib diisi sebelum disimpan.
    purchasePrice: record?.purchasePrice ?? undefined,
    price: record?.price ?? 0,
    stock: record?.stock ?? 0,
  });

  return (
    <FormModal
      title={record ? "Ubah Sparepart" : "Tambah Sparepart"}
      onSubmit={handleSubmit((values) => save.mutate(values))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <FormField control={control} name="name" label="Nama" required render={(field) => <Input size="large" {...field} placeholder="Contoh: Oli Mesin 1L" />} />
      <FormField
        control={control}
        name="purchasePrice"
        label="Harga beli"
        required
        extra="Modal per unit, dipakai menghitung laba di laporan."
        render={(field) => <MoneyInput {...field} placeholder="Harga beli per unit" />}
      />
      <FormField control={control} name="price" label="Harga jual" required render={(field) => <MoneyInput {...field} placeholder="Harga jual per unit" />} />
      <FormField
        control={control}
        name="stock"
        label="Stok awal"
        extra={record ? "Perubahan stok dilakukan lewat Barang Masuk / Stock Opname." : undefined}
        render={(field) => <InputNumber size="large" {...field} min={0} disabled={!!record} placeholder="Stok awal" className="w-full" />}
      />
    </FormModal>
  );
}
