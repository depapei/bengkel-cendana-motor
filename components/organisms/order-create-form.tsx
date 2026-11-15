"use client";

import { useState } from "react";
import { PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Flex, Input, List, Radio, Typography } from "antd";
import { FormContainer } from "@/components/molecules/form-container";
import { FormField } from "@/components/molecules/form-field";
import { PageHeader } from "@/components/molecules/page-header";
import { SearchInput } from "@/components/molecules/search-input";
import { useCustomers } from "@/hooks/queries/use-customers";
import { useCreateOrder } from "@/hooks/queries/use-orders";
import { useModalState } from "@/hooks/use-modal-state";
import { useZodForm } from "@/hooks/use-zod-form";
import { orderCreateSchema } from "@/schemas/order.schema";
import type { Customer, Vehicle } from "@/types/models";
import { CustomerFormModal } from "./customer-form-modal";
import { VehicleFormModal } from "./vehicle-form-modal";

const SEARCH_RESULT_LIMIT = 10;

/** Alur penerimaan customer (Spesifikasi §2.1): cari → pilih/daftar kendaraan → catat keluhan. */
export function OrderCreateForm() {
  const [q, setQ] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const { data, isFetching } = useCustomers({ q, pageSize: SEARCH_RESULT_LIMIT }, q.length > 0);
  const customerModal = useModalState();
  const vehicleModal = useModalState<Customer>();
  const create = useCreateOrder();

  const { control, handleSubmit, setValue, watch } = useZodForm(orderCreateSchema, {
    customerVehicleId: "",
    complaint: "",
    notes: "",
  });
  const vehicleId = watch("customerVehicleId");
  const selectedVehicle = selectedCustomer?.vehicles.find((vehicle) => vehicle.id === vehicleId);

  const selectVehicle = (customer: Customer, vehicle: Vehicle | undefined) => {
    setSelectedCustomer(customer);
    setValue("customerVehicleId", vehicle?.id ?? "", { shouldValidate: !!vehicle });
  };

  const results = data?.items ?? [];
  const customers = selectedCustomer && !results.some((c) => c.id === selectedCustomer.id) ? [selectedCustomer, ...results] : results;

  return (
    <>
      <PageHeader title="Order Baru" subtitle="Cari customer berdasarkan nomor HP atau plat nomor" />

      <Flex vertical gap={16}>
        <Card title="1. Customer & Kendaraan">
          <SearchInput autoFocus placeholder="Nomor HP / plat nomor / nama" onSearch={setQ} />
          <List<Customer>
            className="mt-4"
            loading={isFetching}
            dataSource={customers}
            locale={{
              emptyText: q ? (
                <Empty description="Customer tidak ditemukan — daftarkan sebagai customer baru">
                  <Button type="primary" icon={<UserAddOutlined />} onClick={() => customerModal.show()}>
                    Customer Baru
                  </Button>
                </Empty>
              ) : (
                <Empty description="Ketik untuk mencari customer" />
              ),
            }}
            renderItem={(customer) => (
              <List.Item
                actions={[
                  <Button key="vehicle" size="small" icon={<PlusOutlined />} onClick={() => vehicleModal.show(customer)}>
                    Motor baru
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={customer.name}
                  description={
                    <Flex vertical gap={8}>
                      <span>{customer.phoneNumber}</span>
                      <Radio.Group
                        value={selectedCustomer?.id === customer.id ? vehicleId : undefined}
                        onChange={(event) =>
                          selectVehicle(customer, customer.vehicles.find((v) => v.id === event.target.value))
                        }
                        optionType="button"
                        options={customer.vehicles.map((vehicle) => ({
                          value: vehicle.id,
                          label: `${vehicle.platNomor} · ${vehicle.brand.name} ${vehicle.brand.type}`,
                        }))}
                      />
                      {customer.vehicles.length === 0 && <Typography.Text type="warning">Belum ada kendaraan</Typography.Text>}
                    </Flex>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card title="2. Keluhan">
          <FormContainer onSubmit={handleSubmit((values) => create.mutate(values))}>
            <FormField
              control={control}
              name="customerVehicleId"
              label="Kendaraan terpilih"
              required
              render={() => (
                <Input
                  readOnly
                  placeholder="Pilih kendaraan di atas"
                  value={
                    selectedCustomer && selectedVehicle
                      ? `${selectedCustomer.name} — ${selectedVehicle.platNomor} (${selectedVehicle.brand.name} ${selectedVehicle.brand.type})`
                      : ""
                  }
                />
              )}
            />
            <FormField
              control={control}
              name="complaint"
              label="Keluhan customer"
              required
              render={(field) => <Input.TextArea {...field} rows={3} placeholder="Contoh: rem depan bunyi, tarikan berat" />}
            />
            <FormField
              control={control}
              name="notes"
              label="Catatan bengkel"
              render={(field) => <Input.TextArea {...field} value={field.value ?? ""} rows={2} />}
            />
            <Button type="primary" htmlType="submit" loading={create.isPending}>
              Buat Order (Draft)
            </Button>
          </FormContainer>
        </Card>
      </Flex>

      {customerModal.open && (
        <CustomerFormModal withVehicle onClose={customerModal.close} onSaved={(customer) => selectVehicle(customer, customer.vehicles[0])} />
      )}
      {vehicleModal.open && vehicleModal.record && (
        <VehicleFormModal
          customerId={vehicleModal.record.id}
          onClose={vehicleModal.close}
          onSaved={(vehicle) => {
            const customer = vehicleModal.record!;
            selectVehicle({ ...customer, vehicles: [...customer.vehicles, vehicle] }, vehicle);
          }}
        />
      )}
    </>
  );
}
