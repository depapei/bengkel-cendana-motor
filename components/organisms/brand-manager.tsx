"use client";

import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { IconButton } from "@/components/atoms/icon-button";
import { ConfirmButton } from "@/components/molecules/confirm-button";
import { actionColumn, DataTable } from "@/components/molecules/data-table";
import { PageHeader } from "@/components/molecules/page-header";
import { TableCard } from "@/components/molecules/table-card";
import { useBrands, useDeleteBrand } from "@/hooks/queries/use-brands";
import { useModalState } from "@/hooks/use-modal-state";
import type { Brand } from "@/types/models";
import { BrandFormModal } from "./brand-form-modal";

export function BrandManager() {
  const { data, isLoading } = useBrands();
  const remove = useDeleteBrand();
  const modal = useModalState<Brand>();

  return (
    <>
      <PageHeader
        title="Merek Motor"
        subtitle="Master merek & tipe kendaraan customer"
        extra={
          <Button size="large" type="primary" icon={<PlusOutlined />} onClick={() => modal.show()}>
            Tambah
          </Button>
        }
      />
      <TableCard>
        <DataTable<Brand>
          loading={isLoading}
          dataSource={data}
          pagination={false}
          columns={[
            { title: "Merek", dataIndex: "name" },
            { title: "Tipe", dataIndex: "type" },
            actionColumn((brand) => (
              <>
                <IconButton label="Ubah merek" icon={<EditOutlined />} onClick={() => modal.show(brand)} />
                <ConfirmButton label="Hapus merek" confirmTitle="Hapus merek ini?" onConfirm={() => remove.mutate(brand.id)} />
              </>
            )),
          ]}
        />
      </TableCard>
      {modal.render(<BrandFormModal record={modal.record} onClose={modal.close} />)}
    </>
  );
}
