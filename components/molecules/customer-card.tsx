"use client";

import Link from "next/link";
import { Card, Flex, Typography } from "antd";
import { VehicleLabel } from "@/components/atoms/vehicle-label";
import { AppRoute } from "@/constants/routes";
import type { Customer } from "@/types/models";
import { buildUrl } from "@/utils/url";

interface CustomerCardProps {
  customer: Customer;
}

/** Ringkasan satu customer dalam bentuk card; seluruh card menuju detail customer. */
export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link href={buildUrl(AppRoute.CustomerDetail, { id: customer.id })} className="block h-full">
      <Card hoverable className="h-full" title={customer.name}>
        <Flex vertical gap={8}>
          <Typography.Text type="secondary">{customer.phoneNumber}</Typography.Text>
          <Flex wrap gap={4}>
            {customer.vehicles.map((vehicle) => (
              <VehicleLabel key={vehicle.id} vehicle={vehicle} variant="tag" />
            ))}
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
