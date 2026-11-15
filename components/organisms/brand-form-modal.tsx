"use client";

import { Input } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { useSaveBrand } from "@/hooks/queries/use-brands";
import { useZodForm } from "@/hooks/use-zod-form";
import { brandSchema } from "@/schemas/brand.schema";
import type { Brand } from "@/types/models";

interface BrandFormModalProps {
  record?: Brand;
  onClose: () => void;
}

export function BrandFormModal({ record, onClose }: BrandFormModalProps) {
  const save = useSaveBrand(record?.id, onClose);
  const { control, handleSubmit } = useZodForm(brandSchema, { name: record?.name ?? "", type: record?.type ?? "" });

  return (
    <FormModal
      title={record ? "Ubah Merek Motor" : "Tambah Merek Motor"}
      onSubmit={handleSubmit((values) => save.mutate(values))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <FormField control={control} name="name" label="Merek" required render={(field) => <Input {...field} placeholder="Honda" />} />
      <FormField control={control} name="type" label="Tipe" required render={(field) => <Input {...field} placeholder="Vario 125" />} />
    </FormModal>
  );
}
