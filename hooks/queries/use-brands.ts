"use client";

import { useQuery } from "@tanstack/react-query";
import { MESSAGE } from "@/constants/messages";
import { queryKeys } from "@/constants/query-keys";
import type { BrandInput } from "@/schemas/brand.schema";
import { brandService } from "@/services/brand.service";
import type { Brand } from "@/types/models";
import { useAppMutation } from "../use-app-mutation";

const invalidate = [queryKeys.brands.all];

export function useBrands() {
  return useQuery({ queryKey: queryKeys.brands.all, queryFn: () => brandService.list() });
}

export function useSaveBrand(id?: string, onSuccess?: (brand: Brand) => void) {
  return useAppMutation({
    mutationFn: (input: BrandInput) => (id ? brandService.update(id, input) : brandService.create(input)),
    invalidate,
    onSuccess,
  });
}

export function useDeleteBrand() {
  return useAppMutation({ mutationFn: brandService.remove, invalidate, successMessage: MESSAGE.deleted });
}
