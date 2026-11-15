"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MESSAGE } from "@/constants/messages";
import { queryKeys } from "@/constants/query-keys";
import type { CustomerCreateInput, VehicleInput } from "@/schemas/customer.schema";
import { customerService } from "@/services/customer.service";
import type { ListParams } from "@/types/common";
import type { Customer, Vehicle } from "@/types/models";
import { useAppMutation } from "../use-app-mutation";

const invalidate = [queryKeys.customers.all, queryKeys.orders.all];

export function useCustomers(params: ListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => customerService.list(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useCustomer(id: string) {
  return useQuery({ queryKey: queryKeys.customers.detail(id), queryFn: () => customerService.get(id) });
}

export function useSaveCustomer(id?: string, onSuccess?: (customer: Customer) => void) {
  return useAppMutation({
    mutationFn: (input: CustomerCreateInput) => (id ? customerService.update(id, input) : customerService.create(input)),
    invalidate,
    onSuccess,
  });
}

export function useDeleteCustomer(onSuccess?: () => void) {
  return useAppMutation({ mutationFn: customerService.remove, invalidate, successMessage: MESSAGE.deleted, onSuccess });
}

export function useSaveVehicle(customerId: string, vehicleId?: string, onSuccess?: (vehicle: Vehicle) => void) {
  return useAppMutation({
    mutationFn: (input: VehicleInput) =>
      vehicleId ? customerService.updateVehicle(vehicleId, input) : customerService.addVehicle(customerId, input),
    invalidate,
    onSuccess,
  });
}

export function useDeleteVehicle() {
  return useAppMutation({ mutationFn: customerService.removeVehicle, invalidate, successMessage: MESSAGE.deleted });
}
