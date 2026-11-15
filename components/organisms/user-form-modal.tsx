"use client";

import { Input } from "antd";
import { EnumSelect } from "@/components/molecules/enum-select";
import { FormField } from "@/components/molecules/form-field";
import { FormModal } from "@/components/molecules/form-modal";
import { USER_ROLE_META, UserRole } from "@/constants/user-role";
import { useSaveUser } from "@/hooks/queries/use-users";
import { useZodForm } from "@/hooks/use-zod-form";
import { PASSWORD_MIN, userCreateSchema, userUpdateSchema } from "@/schemas/user.schema";
import type { User } from "@/types/models";

interface UserFormModalProps {
  record?: User;
  onClose: () => void;
}

export function UserFormModal({ record, onClose }: UserFormModalProps) {
  const save = useSaveUser(record?.id, onClose);
  const { control, handleSubmit } = useZodForm(record ? userUpdateSchema : userCreateSchema, {
    name: record?.name ?? "",
    username: record?.username ?? "",
    role: record?.role ?? UserRole.kasir,
    password: "",
  });

  return (
    <FormModal
      title={record ? "Ubah User" : "Tambah User"}
      onSubmit={handleSubmit((values) => save.mutate({ ...values, password: values.password ?? "" }))}
      onCancel={onClose}
      loading={save.isPending}
    >
      <FormField control={control} name="name" label="Nama" required render={(field) => <Input {...field} placeholder="Nama lengkap" />} />
      <FormField control={control} name="username" label="Username" required render={(field) => <Input {...field} placeholder="Username untuk login" />} />
      <FormField
        control={control}
        name="role"
        label="Role"
        required
        render={(field) => <EnumSelect {...field} meta={USER_ROLE_META} placeholder="Pilih role" />}
      />
      <FormField
        control={control}
        name="password"
        label="Password"
        required={!record}
        extra={record ? "Kosongkan jika tidak diubah" : undefined}
        render={(field) => <Input.Password {...field} value={field.value ?? ""} placeholder={record ? "Password baru" : `Minimal ${PASSWORD_MIN} karakter`} autoComplete="new-password" />}
      />
    </FormModal>
  );
}
