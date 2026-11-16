"use client";

import { Input } from "antd";
import type { Control, FieldValues, Path } from "react-hook-form";
import { FormField } from "@/components/molecules/form-field";
import { BrandSelect } from "./brand-select";

interface VehicleFieldsProps<T extends FieldValues, TOut extends FieldValues> {
  control: Control<T, unknown, TOut>;
  /** Prefix nama field, contoh "vehicle." untuk form customer baru. */
  prefix?: "" | `${string}.`;
}

/** Field kendaraan (merek & plat) yang dipakai di form customer & form kendaraan. */
export function VehicleFields<T extends FieldValues, TOut extends FieldValues>({
  control,
  prefix = "",
}: VehicleFieldsProps<T, TOut>) {
  return (
    <>
      <FormField
        control={control}
        name={`${prefix}brandId` as Path<T>}
        label="Merek & tipe motor"
        required
        render={(field) => <BrandSelect {...field} />}
      />
      <FormField
        control={control}
        name={`${prefix}platNomor` as Path<T>}
        label="Plat nomor"
        required
        render={(field) => <Input size="large" {...field} placeholder="B 1234 ABC" className="uppercase" />}
      />
    </>
  );
}
