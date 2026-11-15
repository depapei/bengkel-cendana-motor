"use client";

import { Checkbox } from "antd";
import type { EnumMeta } from "@/types/common";

interface EnumCheckboxGroupProps<T extends string> {
  meta: EnumMeta<T>;
  value?: T[];
  onChange: (value: T[]) => void;
}

/** Checklist multi-pilih yang opsinya dibentuk dari enum + meta label. Kosong = semua. */
export function EnumCheckboxGroup<T extends string>({ meta, value, onChange }: EnumCheckboxGroupProps<T>) {
  const options = (Object.keys(meta) as T[]).map((key) => ({ value: key, label: meta[key].label }));
  return <Checkbox.Group<T> options={options} value={value ?? []} onChange={onChange} />;
}
