"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import type { MechanicUpdateInput } from "@/schemas/mechanic.schema";
import { mechanicService } from "@/services/mechanic.service";
import type { Mechanic } from "@/types/models";
import { useAppMutation } from "../use-app-mutation";

const invalidate = [queryKeys.mechanics.all];

export function useMechanics() {
  return useQuery({ queryKey: queryKeys.mechanics.all, queryFn: () => mechanicService.list() });
}

export function useCreateMechanic(onSuccess?: (mechanic: Mechanic) => void) {
  return useAppMutation({ mutationFn: mechanicService.create, invalidate, onSuccess });
}

/** Satu mutation untuk semua baris tabel; `variables.id` menandai baris yang sedang disimpan. */
export function useUpdateMechanic() {
  return useAppMutation({
    mutationFn: ({ id, input }: { id: string; input: MechanicUpdateInput }) => mechanicService.update(id, input),
    invalidate,
  });
}
