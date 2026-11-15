import { ApiEndpoint } from "@/constants/api-endpoints";
import type { BrandInput } from "@/schemas/brand.schema";
import type { Brand } from "@/types/models";
import { createCrudService } from "./crud.service";

export const brandService = createCrudService<Brand, Brand[], BrandInput>({
  list: ApiEndpoint.Brands,
  detail: ApiEndpoint.BrandDetail,
});
