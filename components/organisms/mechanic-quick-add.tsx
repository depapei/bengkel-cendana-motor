"use client";

import { Input } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { QuickAddRow } from "@/components/molecules/quick-add-row";
import { useCreateMechanic } from "@/hooks/queries/use-mechanics";
import { useZodForm } from "@/hooks/use-zod-form";
import { mechanicSchema } from "@/schemas/mechanic.schema";
import type { Mechanic } from "@/types/models";

/** Form mini tambah mekanik baru di dalam dropdown MechanicSelect. */
export function MechanicQuickAdd({
  onCreated,
}: {
  onCreated: (mechanic: Mechanic) => void;
}) {
  const { control, handleSubmit, reset } = useZodForm(mechanicSchema, {
    name: "",
  });
  const save = useCreateMechanic((mechanic) => {
    reset({ name: "" });
    onCreated(mechanic);
  });

  return (
    <QuickAddRow
      loading={save.isPending}
      onSubmit={() => void handleSubmit((values) => save.mutate(values))()}
    >
      <FormField
        control={control}
        name="name"
        className="mb-0 flex-1"
        render={(field) => <Input {...field} placeholder="Nama mekanik baru" />}
      />
    </QuickAddRow>
  );
}
