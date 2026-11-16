"use client";

import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Result, Space } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { ConfirmButton } from "@/components/molecules/confirm-button";
import { DataTable } from "@/components/molecules/data-table";
import { PageHeader } from "@/components/molecules/page-header";
import { TableCard } from "@/components/molecules/table-card";
import { MESSAGE } from "@/constants/messages";
import { USER_ROLE_META } from "@/constants/user-role";
import { useMe } from "@/hooks/queries/use-auth";
import { useDeleteUser, useUsers } from "@/hooks/queries/use-users";
import { useModalState } from "@/hooks/use-modal-state";
import type { User } from "@/types/models";
import { formatDate } from "@/utils/format";
import { UserFormModal } from "./user-form-modal";

export function UserManager() {
  const { data: me, isAdmin, isLoading: meLoading } = useMe();
  const { data, isLoading } = useUsers(isAdmin);
  const remove = useDeleteUser();
  const modal = useModalState<User>();

  if (!meLoading && !isAdmin) return <Result status="403" title={MESSAGE.forbidden} />;

  return (
    <>
      <PageHeader
        title="User"
        subtitle="Akun login admin & kasir"
        extra={
          <Button size="large" type="primary" icon={<PlusOutlined />} onClick={() => modal.show()}>
            Tambah
          </Button>
        }
      />
      <TableCard>
      <DataTable<User>
        loading={isLoading}
        dataSource={data}
        pagination={false}
        columns={[
          { title: "Nama", dataIndex: "name" },
          { title: "Username", dataIndex: "username" },
          { title: "Role", dataIndex: "role", render: (role: User["role"]) => <StatusTag value={role} meta={USER_ROLE_META} /> },
          { title: "Dibuat", dataIndex: "createdAt", render: formatDate },
          {
            title: "Aksi",
            width: 120,
            render: (_, user) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => modal.show(user)} />
                <ConfirmButton
                  confirmTitle="Hapus user ini?"
                  disabled={user.id === me?.id}
                  onConfirm={() => remove.mutate(user.id)}
                />
              </Space>
            ),
          },
        ]}
      />
      </TableCard>
      {modal.render(<UserFormModal record={modal.record} onClose={modal.close} />)}
    </>
  );
}
