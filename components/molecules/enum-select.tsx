"use client";

import { Select, type SelectProps } from "antd";
import type { EnumMeta } from "@/types/common";

interface EnumSelectProps<T extends string> extends Omit<SelectProps<T>, "options"> {
  meta: EnumMeta<T>;
  /** Batasi pilihan ke sebagian nilai enum. */
  only?: readonly T[];
}

/** Select yang opsinya dibentuk dari enum + meta label. */
export function EnumSelect<T extends string>({ meta, only, ...props }: EnumSelectProps<T>) {
  const values = only ?? (Object.keys(meta) as T[]);
  return <Select<T> size="large" options={values.map((value) => ({ value, label: meta[value].label }))} {...props} />;
}
