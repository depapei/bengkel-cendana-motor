"use client";

import { Input } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { QuickAddRow } from "@/components/molecules/quick-add-row";
import { useSaveBrand } from "@/hooks/queries/use-brands";
import { useZodForm } from "@/hooks/use-zod-form";
import { brandSchema } from "@/schemas/brand.schema";
import type { Brand } from "@/types/models";

interface BrandQuickAddProps {
  onCreated: (brand: Brand) => void;
}

/** Form mini tambah merek & tipe di dalam dropdown BrandSelect. */
export function BrandQuickAdd({ onCreated }: BrandQuickAddProps) {
  const { control, handleSubmit, reset } = useZodForm(brandSchema, { name: "", type: "" });
  const save = useSaveBrand(undefined, (brand) => {
    reset({ name: brand.name, type: "" });
    onCreated(brand);
  });

  return (
    <QuickAddRow loading={save.isPending} onSubmit={() => void handleSubmit((values) => save.mutate(values))()}>
      <FormField
        control={control}
        name="name"
        className="mb-0 flex-1"
        render={(field) => <Input size="large" {...field} placeholder="Merek (Honda)" />}
      />
      <FormField
        control={control}
        name="type"
        className="mb-0 flex-1"
        render={(field) => <Input size="large" {...field} placeholder="Tipe (Vario 125)" />}
      />
    </QuickAddRow>
  );
}
