"use client";

import { FormModal } from "@/components/molecules/form-modal";
import { useSaveVehicle } from "@/hooks/queries/use-customers";
import { useZodForm } from "@/hooks/use-zod-form";
import { vehicleSchema } from "@/schemas/customer.schema";
import type { Vehicle } from "@/types/models";
import { VehicleFields } from "./vehicle-fields";

interface VehicleFormModalProps {
  customerId: string;
  record?: Vehicle;
  onClose: () => void;
  onSaved?: (vehicle: Vehicle) => void;
}

export function VehicleFormModal({ customerId, record, onClose, onSaved }: VehicleFormModalProps) {
  const save = useSaveVehicle(customerId, record?.id, (vehicle) => {
    onSaved?.(vehicle);
    onClose();
  });
  const { control, handleSubmit } = useZodForm(vehicleSchema, {
    brandId: record?.brandId,
    platNomor: record?.platNomor ?? "",
  });

  return (
    <FormModal
      title={record ? "Ubah Kendaraan" : "Tambah Kendaraan"}
      onSubmit={handleSubmit((values) => save.mutate(values))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <VehicleFields control={control} />
    </FormModal>
  );
}
