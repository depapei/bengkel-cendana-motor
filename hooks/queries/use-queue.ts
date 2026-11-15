"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUEUE_REFRESH_INTERVAL_MS } from "@/constants/app";
import { queryKeys } from "@/constants/query-keys";
import { queueService } from "@/services/queue.service";
import type { ListParams } from "@/types/common";

/** Antrean hari ini; di-refresh otomatis agar status pengerjaan selalu terbaru. */
export function useQueue(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.queue.list(params),
    queryFn: () => queueService.list(params),
    placeholderData: keepPreviousData,
    refetchInterval: QUEUE_REFRESH_INTERVAL_MS,
  });
}

export function useQueueOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.queue.detail(id),
    queryFn: () => queueService.get(id),
    refetchInterval: QUEUE_REFRESH_INTERVAL_MS,
  });
}
