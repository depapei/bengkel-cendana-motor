"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
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
import { OrderFields } from "./order-fields";
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

  const form = useZodForm(orderCreateSchema, {
    customerVehicleId: "",
    complaint: "",
    notes: "",
    mileage: undefined,
    mechanicId: null,
    mechanicNote: null,
    nextServiceDate: null,
    nextServiceNote: null,
  });
  const { control, handleSubmit, setValue, watch } = form;
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
                  <Button size="large" type="primary" icon={<UserAddOutlined />} onClick={() => customerModal.show()}>
                    Customer Baru
                  </Button>
                </Empty>
              ) : (
                <Empty description="Ketik untuk mencari customer">
                  <Button size="large" type="primary" icon={<UserAddOutlined />} onClick={() => customerModal.show()}>
                    Customer Baru
                  </Button>
                </Empty>
              ),
            }}
            renderItem={(customer) => (
              <List.Item
                actions={[
                  <Button size="large" key="vehicle" icon={<PlusOutlined />} onClick={() => vehicleModal.show(customer)}>
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
                        size="large"
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

        <Card title="2. Detail Service">
          <FormProvider {...form}>
            <FormContainer onSubmit={handleSubmit((values) => create.mutate(values))}>
              <FormField
                control={control}
                name="customerVehicleId"
                label="Kendaraan terpilih"
                required
                render={() => (
                  <Input
                    size="large"
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
              <OrderFields />
              <Button size="large" type="primary" htmlType="submit" loading={create.isPending}>
                Buat Order (Draft)
              </Button>
            </FormContainer>
          </FormProvider>
        </Card>
      </Flex>

      {customerModal.render(
        <CustomerFormModal withVehicle onClose={customerModal.close} onSaved={(customer) => selectVehicle(customer, customer.vehicles[0])} />
      )}
      {vehicleModal.render(vehicleModal.record && (
        <VehicleFormModal
          customerId={vehicleModal.record.id}
          onClose={vehicleModal.close}
          onSaved={(vehicle) => {
            const customer = vehicleModal.record!;
            selectVehicle({ ...customer, vehicles: [...customer.vehicles, vehicle] }, vehicle);
          }}
        />
      ))}
    </>
  );
}
