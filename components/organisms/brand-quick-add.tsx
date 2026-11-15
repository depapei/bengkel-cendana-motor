"use client";

import type { KeyboardEvent } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { useSaveBrand } from "@/hooks/queries/use-brands";
import { useZodForm } from "@/hooks/use-zod-form";
import { brandSchema } from "@/schemas/brand.schema";
import type { Brand } from "@/types/models";

interface BrandQuickAddProps {
  onCreated: (brand: Brand) => void;
}

/**
 * Form mini tambah merek & tipe di dalam dropdown BrandSelect.
 * Sengaja tanpa <form>: dropdown di-portal tapi event React tetap bubble
 * ke form induk (customer/kendaraan), jadi submit ditangani manual.
 */
export function BrandQuickAdd({ onCreated }: BrandQuickAddProps) {
  const { control, handleSubmit, reset } = useZodForm(brandSchema, { name: "", type: "" });
  const save = useSaveBrand(undefined, (brand) => {
    reset({ name: brand.name, type: "" });
    onCreated(brand);
  });

  const submit = handleSubmit((values) => save.mutate(values));

  // Cegah Select induk menangkap tombol keyboard (spasi, panah, Enter).
  const handleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <Flex gap={8} align="flex-start" className="px-2 pt-2 pb-1" onKeyDown={handleKeyDown}>
      <FormField
        control={control}
        name="name"
        className="mb-0 flex-1"
        render={(field) => <Input {...field} placeholder="Merek (Honda)" />}
      />
      <FormField
        control={control}
        name="type"
        className="mb-0 flex-1"
        render={(field) => <Input {...field} placeholder="Tipe (Vario 125)" />}
      />
      <Button type="primary" icon={<PlusOutlined />} loading={save.isPending} onClick={() => void submit()}>
        Tambah
      </Button>
    </Flex>
  );
}
