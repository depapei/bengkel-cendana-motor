"use client";

import type { SelectProps } from "antd";
import { QuickAddSelect } from "@/components/molecules/quick-add-select";
import { useMechanics } from "@/hooks/queries/use-mechanics";
import { MechanicQuickAdd } from "./mechanic-quick-add";

/** Pilih mekanik yang ditugaskan; mekanik baru bisa langsung ditambahkan dari dropdown. */
export function MechanicSelect({
  onChange,
  ...props
}: Omit<SelectProps<string>, "options">) {
  const { data = [], isLoading } = useMechanics();

  return (
    <QuickAddSelect<string>
      showSearch={{ optionFilterProp: "label" }}
      allowClear
      placeholder="Pilih mekanik"
      loading={isLoading}
      options={data.map((mechanic) => ({
        value: mechanic.id,
        label: mechanic.name,
      }))}
      onChange={onChange}
      renderQuickAdd={(close) => (
        <MechanicQuickAdd
          onCreated={(mechanic) => {
            onChange?.(mechanic.id, {
              value: mechanic.id,
              label: mechanic.name,
            });
            close();
          }}
        />
      )}
      {...props}
    />
  );
}
