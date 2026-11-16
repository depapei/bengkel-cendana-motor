"use client";

import { Input } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { useCreateMechanic } from "@/hooks/queries/use-mechanics";
import { useZodForm } from "@/hooks/use-zod-form";
import { mechanicSchema } from "@/schemas/mechanic.schema";

/** Tambah mekanik baru. Ubah data dilakukan inline di tabel MechanicManager. */
export function MechanicFormModal({ onClose }: { onClose: () => void }) {
  const save = useCreateMechanic(onClose);
  const { control, handleSubmit } = useZodForm(mechanicSchema, { name: "", phoneNumber: "" });

  return (
    <FormModal
      title="Tambah Mekanik"
      onSubmit={handleSubmit((values) => save.mutate(values))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <FormField control={control} name="name" label="Nama" required render={(field) => <Input size="large" {...field} placeholder="Nama mekanik" />} />
      <FormField
        control={control}
        name="phoneNumber"
        label="Nomor HP"
        render={(field) => <Input size="large" {...field} value={field.value ?? ""} placeholder="0812xxxxxxxx" inputMode="tel" />}
      />
    </FormModal>
  );
}
