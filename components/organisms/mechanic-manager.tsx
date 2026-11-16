"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Switch } from "antd";
import { DataTable } from "@/components/molecules/data-table";
import { InlineEdit } from "@/components/molecules/inline-edit";
import { PageHeader } from "@/components/molecules/page-header";
import { TableCard } from "@/components/molecules/table-card";
import { useMechanics, useUpdateMechanic } from "@/hooks/queries/use-mechanics";
import { useModalState } from "@/hooks/use-modal-state";
import { mechanicUpdateSchema, type MechanicUpdateInput } from "@/schemas/mechanic.schema";
import type { Mechanic } from "@/types/models";
import { MechanicFormModal } from "./mechanic-form-modal";

type Field = keyof MechanicUpdateInput;
type TextField = Extract<Field, "name" | "phoneNumber">;

export function MechanicManager() {
  const { data, isLoading } = useMechanics();
  const update = useUpdateMechanic();
  const modal = useModalState<Mechanic>();

  /** Baris & field yang sedang disimpan, supaya loading tidak muncul di semua baris. */
  const saving = (mechanic: Mechanic, field: Field) =>
    update.isPending && update.variables?.id === mechanic.id && field in update.variables.input;

  const save = (mechanic: Mechanic, input: MechanicUpdateInput) => update.mutateAsync({ id: mechanic.id, input });

  const textField = (mechanic: Mechanic, name: TextField, placeholder: string) => (
    <InlineEdit<string>
      value={mechanic[name] ?? ""}
      display={mechanic[name] || "-"}
      loading={saving(mechanic, name)}
      validate={(value) => mechanicUpdateSchema.safeParse({ [name]: value }).error?.issues[0]?.message}
      onSave={(value) => save(mechanic, { [name]: value })}
      renderInput={({ value, onChange, onSubmit, ...props }) => (
        <Input
          size="large"
          {...props}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onPressEnter={onSubmit}
          placeholder={placeholder}
        />
      )}
    />
  );

  return (
    <>
      <PageHeader
        title="Mekanik"
        subtitle="Mekanik yang bisa ditugaskan ke order servis"
        extra={
          <Button size="large" type="primary" icon={<PlusOutlined />} onClick={() => modal.show()}>
            Tambah
          </Button>
        }
      />
      <TableCard>
        <DataTable<Mechanic>
          loading={isLoading}
          dataSource={data}
          pagination={false}
          columns={[
            { title: "Nama", dataIndex: "name", width: "45%", render: (_, mechanic) => textField(mechanic, "name", "Nama mekanik") },
            {
              title: "Nomor HP",
              dataIndex: "phoneNumber",
              width: "35%",
              render: (_, mechanic) => textField(mechanic, "phoneNumber", "0812xxxxxxxx"),
            },
            {
              title: "Status",
              dataIndex: "isActive",
              width: 140,
              render: (_, mechanic) => (
                <Switch
                  checked={mechanic.isActive}
                  checkedChildren="Aktif"
                  unCheckedChildren="Nonaktif"
                  loading={saving(mechanic, "isActive")}
                  onChange={(isActive) => void save(mechanic, { isActive }).catch(() => undefined)}
                />
              ),
            },
          ]}
        />
      </TableCard>
      {modal.render(<MechanicFormModal onClose={modal.close} />)}
    </>
  );
}
