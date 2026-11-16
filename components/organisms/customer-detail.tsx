"use client";

import { useRouter } from "nextjs-toploader/app";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Select, Space } from "antd";
import { IconButton } from "@/components/atoms/icon-button";
import { ConfirmButton } from "@/components/molecules/confirm-button";
import { actionColumn, DataTable } from "@/components/molecules/data-table";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
import { TableCard } from "@/components/molecules/table-card";
import { AppRoute } from "@/constants/routes";
import { useCustomer, useDeleteCustomer, useDeleteVehicle } from "@/hooks/queries/use-customers";
import { useListParams } from "@/hooks/use-list-params";
import { useModalState } from "@/hooks/use-modal-state";
import type { Customer, Vehicle } from "@/types/models";
import type { OrderListParams } from "@/types/order";
import { formatDate } from "@/utils/format";
import { CustomerFormModal } from "./customer-form-modal";
import { OrderTable } from "./order-table";
import { VehicleFormModal } from "./vehicle-form-modal";

export function CustomerDetail({ id }: { id: string }) {
  const query = useCustomer(id);
  return <QueryState {...query}>{(customer) => <CustomerDetailView customer={customer} />}</QueryState>;
}

function CustomerDetailView({ customer }: { customer: Customer }) {
  const router = useRouter();
  const removeCustomer = useDeleteCustomer(() => router.replace(AppRoute.Customers));
  const removeVehicle = useDeleteVehicle();
  const customerModal = useModalState();
  const vehicleModal = useModalState<Vehicle>();
  const history = useListParams<OrderListParams>({ customerId: customer.id });

  return (
    <>
      <PageHeader
        title={customer.name}
        backHref={AppRoute.Customers}
        subtitle={`${customer.phoneNumber} · Customer sejak ${formatDate(customer.createdAt)}`}
        extra={
          <>
            <Button size="large" icon={<EditOutlined />} onClick={() => customerModal.show()}>
              Ubah
            </Button>
            <ConfirmButton
              confirmTitle="Hapus customer ini beserta kendaraannya?"
              onConfirm={() => removeCustomer.mutate(customer.id)}
            >
              Hapus
            </ConfirmButton>
          </>
        }
      />

      <Space orientation="vertical" size="large" className="w-full">
        <TableCard
          title="Kendaraan"
          extra={
            <Button size="large" icon={<PlusOutlined />} onClick={() => vehicleModal.show()}>
              Tambah
            </Button>
          }
        >
          <DataTable<Vehicle>
            dataSource={customer.vehicles}
            pagination={false}
            columns={[
              { title: "Plat Nomor", dataIndex: "platNomor" },
              { title: "Merek", key: "brand", render: (_, vehicle) => `${vehicle.brand.name} ${vehicle.brand.type}` },
              { title: "Terdaftar", dataIndex: "createdAt", render: formatDate },
              actionColumn((vehicle) => (
                <>
                  <IconButton label="Ubah kendaraan" icon={<EditOutlined />} onClick={() => vehicleModal.show(vehicle)} />
                  <ConfirmButton label="Hapus kendaraan" confirmTitle="Hapus kendaraan ini?" onConfirm={() => removeVehicle.mutate(vehicle.id)} />
                </>
              )),
            ]}
          />
        </TableCard>

        <TableCard
          title="Riwayat Servis"
          extra={
            <Select
              size="large"
              allowClear
              placeholder="Semua kendaraan"
              className="min-w-48"
              options={customer.vehicles.map((vehicle) => ({ value: vehicle.id, label: vehicle.platNomor }))}
              onChange={(customerVehicleId?: string) => history.setFilter({ customerVehicleId })}
            />
          }
        >
          <OrderTable params={history.params} pagination={history.pagination} hideCustomer />
        </TableCard>
      </Space>

      {customerModal.render(<CustomerFormModal record={customer} onClose={customerModal.close} />)}
      {vehicleModal.render(
        <VehicleFormModal customerId={customer.id} record={vehicleModal.record} onClose={vehicleModal.close} />
      )}
    </>
  );
}
