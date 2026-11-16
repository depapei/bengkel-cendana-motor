"use client";

import Link from "next/link";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { IconButton } from "@/components/atoms/icon-button";
import { Money } from "@/components/atoms/money";
import { StockBadge } from "@/components/atoms/stock-badge";
import { ConfirmButton } from "@/components/molecules/confirm-button";
import { actionColumn, DataTable } from "@/components/molecules/data-table";
import { PageHeader } from "@/components/molecules/page-header";
import { SearchInput } from "@/components/molecules/search-input";
import { TableCard } from "@/components/molecules/table-card";
import { MESSAGE } from "@/constants/messages";
import { AppRoute } from "@/constants/routes";
import { useDeleteSparePart, useSpareParts } from "@/hooks/queries/use-spare-parts";
import { useListParams } from "@/hooks/use-list-params";
import { useModalState } from "@/hooks/use-modal-state";
import type { SparePart } from "@/types/models";
import { buildUrl } from "@/utils/url";
import { SparePartFormModal } from "./spare-part-form-modal";

export function SparePartManager() {
  const { params, setFilter, pagination } = useListParams();
  const { data, isFetching } = useSpareParts(params);
  const remove = useDeleteSparePart();
  const modal = useModalState<SparePart>();

  return (
    <>
      <PageHeader
        title="Sparepart"
        subtitle="Master sparepart, harga jual, dan stok"
        extra={
          <Button size="large" type="primary" icon={<PlusOutlined />} onClick={() => modal.show()}>
            Tambah
          </Button>
        }
      />
      <TableCard toolbar={<SearchInput placeholder="Cari nama sparepart" onSearch={(q) => setFilter({ q })} />}>
        <DataTable<SparePart>
          loading={isFetching}
          dataSource={data?.items}
          pagination={pagination(data?.total)}
          columns={[
            {
              title: "Nama",
              dataIndex: "name",
              render: (name: string, part) => <Link href={buildUrl(AppRoute.SparePartDetail, { id: part.id })}>{name}</Link>,
            },
            {
              title: "Harga Beli",
              dataIndex: "purchasePrice",
              align: "right",
              render: (value: number | null) => <Money value={value} emptyText={MESSAGE.purchasePriceMissing} />,
            },
            { title: "Harga Jual", dataIndex: "price", align: "right", render: (value: number) => <Money value={value} /> },
            { title: "Stok", dataIndex: "stock", align: "right", render: (stock: number) => <StockBadge stock={stock} /> },
            actionColumn((part) => (
              <>
                <IconButton label="Ubah sparepart" icon={<EditOutlined />} onClick={() => modal.show(part)} />
                <ConfirmButton label="Hapus sparepart" confirmTitle="Hapus sparepart ini?" onConfirm={() => remove.mutate(part.id)} />
              </>
            )),
          ]}
        />
      </TableCard>
      {modal.render(<SparePartFormModal record={modal.record} onClose={modal.close} />)}
    </>
  );
}
