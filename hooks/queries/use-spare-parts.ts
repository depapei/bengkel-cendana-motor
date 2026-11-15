"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MESSAGE } from "@/constants/messages";
import { queryKeys } from "@/constants/query-keys";
import type { SparePartCreateInput, StockMovementInput } from "@/schemas/spare-part.schema";
import { sparePartService } from "@/services/spare-part.service";
import type { ListParams } from "@/types/common";
import { useAppMutation } from "../use-app-mutation";

const invalidate = [queryKeys.spareParts.all, queryKeys.dashboard.all, queryKeys.reports.all];

export function useSpareParts(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.spareParts.list(params),
    queryFn: () => sparePartService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useSparePart(id: string) {
  return useQuery({ queryKey: queryKeys.spareParts.detail(id), queryFn: () => sparePartService.get(id) });
}

export function useStockMovements(id: string, params: ListParams) {
  return useQuery({
    queryKey: queryKeys.spareParts.movements(id, params),
    queryFn: () => sparePartService.listMovements(id, params),
    placeholderData: keepPreviousData,
  });
}

/** Saat edit, stok diabaikan oleh API (perubahan stok wajib lewat pergerakan stok). */
export function useSaveSparePart(id?: string, onSuccess?: () => void) {
  return useAppMutation({
    mutationFn: (input: SparePartCreateInput) =>
      id ? sparePartService.update(id, input) : sparePartService.create(input),
    invalidate,
    onSuccess,
  });
}

export function useDeleteSparePart(onSuccess?: () => void) {
  return useAppMutation({ mutationFn: sparePartService.remove, invalidate, successMessage: MESSAGE.deleted, onSuccess });
}

export function useAddStockMovement(id: string, onSuccess?: () => void) {
  return useAppMutation({
    mutationFn: (input: StockMovementInput) => sparePartService.addMovement(id, input),
    invalidate,
    onSuccess,
  });
}
