"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { VehicleLabel } from "@/components/atoms/vehicle-label";
import { CustomerCard } from "@/components/molecules/customer-card";
import { DataView } from "@/components/molecules/data-view";
import { PageHeader } from "@/components/molecules/page-header";
import { SearchInput } from "@/components/molecules/search-input";
import { TableCard } from "@/components/molecules/table-card";
import { ViewModeToggle } from "@/components/molecules/view-mode-toggle";
import { AppRoute } from "@/constants/routes";
import { DEFAULT_VIEW_MODE } from "@/constants/view-mode";
import { useCustomers } from "@/hooks/queries/use-customers";
import { useListParams } from "@/hooks/use-list-params";
import { useModalState } from "@/hooks/use-modal-state";
import type { Customer } from "@/types/models";
import { buildUrl } from "@/utils/url";
import { CustomerFormModal } from "./customer-form-modal";

export function CustomerManager() {
  const { params, setFilter, pagination } = useListParams();
  const { data, isFetching } = useCustomers(params);
  const modal = useModalState();
  const [view, setView] = useState(DEFAULT_VIEW_MODE);

  return (
    <>
      <PageHeader
        title="Customer"
        subtitle="Data customer & kendaraannya"
        extra={
          <Button size="large" type="primary" icon={<PlusOutlined />} onClick={() => modal.show()}>
            Customer Baru
          </Button>
        }
      />
      <TableCard
        toolbar={
          <>
            <SearchInput placeholder="Cari nama, nomor HP, atau plat nomor" onSearch={(q) => setFilter({ q })} />
            <ViewModeToggle value={view} onChange={setView} />
          </>
        }
      >
      <DataView<Customer>
        view={view}
        loading={isFetching}
        dataSource={data?.items}
        pagination={pagination(data?.total)}
        renderItem={(customer) => <CustomerCard customer={customer} />}
        columns={[
          {
            title: "Nama",
            dataIndex: "name",
            render: (name: string, customer) => (
              <Link href={buildUrl(AppRoute.CustomerDetail, { id: customer.id })}>{name}</Link>
            ),
          },
          { title: "Nomor HP", dataIndex: "phoneNumber" },
          {
            title: "Kendaraan",
            key: "vehicles",
            render: (_, customer) =>
              customer.vehicles.map((vehicle) => <VehicleLabel key={vehicle.id} vehicle={vehicle} variant="tag" />),
          },
        ]}
      />
      </TableCard>
      {modal.render(<CustomerFormModal withVehicle onClose={modal.close} />)}
    </>
  );
}
