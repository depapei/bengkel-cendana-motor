import { ApiEndpoint } from "@/constants/api-endpoints";
import type { MechanicInput, MechanicUpdateInput } from "@/schemas/mechanic.schema";
import type { Mechanic } from "@/types/models";
import { createCrudService } from "./crud.service";

export const mechanicService = createCrudService<Mechanic, Mechanic[], MechanicInput, MechanicUpdateInput>({
  list: ApiEndpoint.Mechanics,
  detail: ApiEndpoint.MechanicDetail,
});
