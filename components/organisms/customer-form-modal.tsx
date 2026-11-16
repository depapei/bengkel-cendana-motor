"use client";

import { Divider, Input } from "antd";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { useSaveCustomer } from "@/hooks/queries/use-customers";
import { useZodForm } from "@/hooks/use-zod-form";
import { customerCreateSchema } from "@/schemas/customer.schema";
import type { Customer } from "@/types/models";
import { VehicleFields } from "./vehicle-fields";

interface CustomerFormModalProps {
  record?: Customer;
  /** Pendaftaran customer baru sekaligus kendaraan pertamanya. */
  withVehicle?: boolean;
  onClose: () => void;
  onSaved?: (customer: Customer) => void;
}

export function CustomerFormModal({ record, withVehicle, onClose, onSaved }: CustomerFormModalProps) {
  const includeVehicle = withVehicle && !record;
  const save = useSaveCustomer(record?.id, (customer) => {
    onSaved?.(customer);
    onClose();
  });
  const { control, handleSubmit } = useZodForm(customerCreateSchema, {
    name: record?.name ?? "",
    phoneNumber: record?.phoneNumber ?? "",
    ...(includeVehicle && { vehicle: { platNomor: "" } }),
  });

  return (
    <FormModal
      title={record ? "Ubah Customer" : "Customer Baru"}
      onSubmit={handleSubmit((values) => save.mutate(values))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <FormField control={control} name="name" label="Nama" required render={(field) => <Input size="large" {...field} placeholder="Nama lengkap customer" />} />
      <FormField
        control={control}
        name="phoneNumber"
        label="Nomor HP"
        required
        render={(field) => <Input size="large" {...field} placeholder="0812xxxxxxxx" inputMode="tel" />}
      />
      {includeVehicle && (
        <>
          <Divider titlePlacement="start">Kendaraan</Divider>
          <VehicleFields control={control} prefix="vehicle." />
        </>
      )}
    </FormModal>
  );
}
