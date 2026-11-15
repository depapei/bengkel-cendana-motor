import { ApiEndpoint } from "@/constants/api-endpoints";
import { api } from "@/lib/axios";
import type { CustomerCreateInput, CustomerInput, VehicleInput } from "@/schemas/customer.schema";
import type { ListParams, Paginated } from "@/types/common";
import type { Customer, Vehicle } from "@/types/models";
import { buildUrl } from "@/utils/url";
import { createCrudService } from "./crud.service";

export const customerService = {
  ...createCrudService<Customer, Paginated<Customer>, CustomerCreateInput, CustomerInput, ListParams>({
    list: ApiEndpoint.Customers,
    detail: ApiEndpoint.CustomerDetail,
  }),
  addVehicle: (customerId: string, input: VehicleInput) =>
    api.post<Vehicle>(buildUrl(ApiEndpoint.CustomerVehicles, { id: customerId }), input).then((res) => res.data),
  updateVehicle: (id: string, input: VehicleInput) =>
    api.patch<Vehicle>(buildUrl(ApiEndpoint.VehicleDetail, { id }), input).then((res) => res.data),
  removeVehicle: (id: string) => api.delete(buildUrl(ApiEndpoint.VehicleDetail, { id })).then(() => undefined),
};
