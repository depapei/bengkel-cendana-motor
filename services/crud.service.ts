import type { ApiEndpoint } from "@/constants/api-endpoints";
import { api } from "@/lib/axios";
import { buildUrl } from "@/utils/url";

/** Pola CRUD standar agar service per domain tidak menulis ulang hal yang sama. */
export function createCrudService<TItem, TList, TCreate, TUpdate = TCreate, TParams = undefined>(endpoints: {
  list: ApiEndpoint;
  detail: ApiEndpoint;
}) {
  return {
    list: (params?: TParams) => api.get<TList>(endpoints.list, { params }).then((res) => res.data),
    get: (id: string) => api.get<TItem>(buildUrl(endpoints.detail, { id })).then((res) => res.data),
    create: (input: TCreate) => api.post<TItem>(endpoints.list, input).then((res) => res.data),
    update: (id: string, input: TUpdate) =>
      api.patch<TItem>(buildUrl(endpoints.detail, { id }), input).then((res) => res.data),
    remove: (id: string) => api.delete(buildUrl(endpoints.detail, { id })).then(() => undefined),
  };
}
