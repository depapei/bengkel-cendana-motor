import { ApiEndpoint } from "@/constants/api-endpoints";
import { api } from "@/lib/axios";
import type { ListParams } from "@/types/common";
import type { QueueOrderDetail, QueuePage } from "@/types/queue";
import { buildUrl } from "@/utils/url";

/** Papan antrean publik (tanpa login). */
export const queueService = {
  list: (params?: ListParams) => api.get<QueuePage>(ApiEndpoint.Queue, { params }).then((res) => res.data),
  get: (id: string) => api.get<QueueOrderDetail>(buildUrl(ApiEndpoint.QueueDetail, { id })).then((res) => res.data),
};
