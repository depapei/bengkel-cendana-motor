import { ApiEndpoint } from "@/constants/api-endpoints";
import { api } from "@/lib/axios";
import type { SparePartCreateInput, SparePartInput, StockMovementInput } from "@/schemas/spare-part.schema";
import type { ListParams, Paginated } from "@/types/common";
import type { SparePart, StockMovement } from "@/types/models";
import { buildUrl } from "@/utils/url";
import { createCrudService } from "./crud.service";

export const sparePartService = {
  ...createCrudService<SparePart, Paginated<SparePart>, SparePartCreateInput, SparePartInput, ListParams>({
    list: ApiEndpoint.SpareParts,
    detail: ApiEndpoint.SparePartDetail,
  }),
  listMovements: (id: string, params?: ListParams) =>
    api
      .get<Paginated<StockMovement>>(buildUrl(ApiEndpoint.SparePartStockMovements, { id }), { params })
      .then((res) => res.data),
  addMovement: (id: string, input: StockMovementInput) =>
    api.post<SparePart>(buildUrl(ApiEndpoint.SparePartStockMovements, { id }), input).then((res) => res.data),
};
