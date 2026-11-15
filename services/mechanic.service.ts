import { ApiEndpoint } from "@/constants/api-endpoints";
import { api } from "@/lib/axios";
import type { MechanicInput } from "@/schemas/mechanic.schema";
import type { Mechanic } from "@/types/models";

export const mechanicService = {
  list: () => api.get<Mechanic[]>(ApiEndpoint.Mechanics).then((res) => res.data),
  create: (input: MechanicInput) => api.post<Mechanic>(ApiEndpoint.Mechanics, input).then((res) => res.data),
};
