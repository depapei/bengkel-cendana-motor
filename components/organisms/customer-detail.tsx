"use client";

import { useRouter } from "next/navigation";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Select, Space } from "antd";
import { ConfirmButton } from "@/components/molecules/confirm-button";
import { DataTable } from "@/components/molecules/data-table";
import { PageHeader } from "@/components/molecules/page-header";
import { QueryState } from "@/components/molecules/query-state";
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
            <Button icon={<EditOutlined />} onClick={() => customerModal.show()}>
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
        <Card title="Kendaraan" extra={<Button icon={<PlusOutlined />} onClick={() => vehicleModal.show()}>Tambah</Button>}>
          <DataTable<Vehicle>
            dataSource={customer.vehicles}
            pagination={false}
            columns={[
              { title: "Plat Nomor", dataIndex: "platNomor" },
              { title: "Merek", key: "brand", render: (_, vehicle) => `${vehicle.brand.name} ${vehicle.brand.type}` },
              { title: "Terdaftar", dataIndex: "createdAt", render: formatDate },
              {
                title: "Aksi",
                width: 120,
                render: (_, vehicle) => (
                  <Space>
                    <Button icon={<EditOutlined />} onClick={() => vehicleModal.show(vehicle)} />
                    <ConfirmButton confirmTitle="Hapus kendaraan ini?" onConfirm={() => removeVehicle.mutate(vehicle.id)} />
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        <Card
          title="Riwayat Servis"
          extra={
            <Select
              allowClear
              placeholder="Semua kendaraan"
              className="min-w-48"
              options={customer.vehicles.map((vehicle) => ({ value: vehicle.id, label: vehicle.platNomor }))}
              onChange={(customerVehicleId?: string) => history.setFilter({ customerVehicleId })}
            />
          }
        >
          <OrderTable params={history.params} pagination={history.pagination} hideCustomer />
        </Card>
      </Space>

      {customerModal.open && <CustomerFormModal record={customer} onClose={customerModal.close} />}
      {vehicleModal.open && (
        <VehicleFormModal customerId={customer.id} record={vehicleModal.record} onClose={vehicleModal.close} />
      )}
    </>
  );
}
