"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { mechanicService } from "@/services/mechanic.service";
import type { Mechanic } from "@/types/models";
import { useAppMutation } from "../use-app-mutation";

export function useMechanics() {
  return useQuery({ queryKey: queryKeys.mechanics.all, queryFn: () => mechanicService.list() });
}

export function useCreateMechanic(onSuccess?: (mechanic: Mechanic) => void) {
  return useAppMutation({ mutationFn: mechanicService.create, invalidate: [queryKeys.mechanics.all], onSuccess });
}
