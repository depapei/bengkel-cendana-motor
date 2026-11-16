"use client";

import { Flex, Typography } from "antd";
import { VehicleLabel } from "@/components/atoms/vehicle-label";
import { ListCard } from "@/components/molecules/list-card";
import { AppRoute } from "@/constants/routes";
import type { Customer } from "@/types/models";
import { buildUrl } from "@/utils/url";

interface CustomerCardProps {
  customer: Customer;
}

/** Ringkasan satu customer dalam bentuk card; seluruh card menuju detail customer. */
export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <ListCard href={buildUrl(AppRoute.CustomerDetail, { id: customer.id })} title={customer.name}>
      <Typography.Text type="secondary">{customer.phoneNumber}</Typography.Text>
      <Flex wrap gap={4}>
        {customer.vehicles.map((vehicle) => (
          <VehicleLabel key={vehicle.id} vehicle={vehicle} variant="tag" />
        ))}
      </Flex>
    </ListCard>
  );
}
