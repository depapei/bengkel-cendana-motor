import { ApiEndpoint } from "@/constants/api-endpoints";
import { api } from "@/lib/axios";
import type { LoginInput } from "@/schemas/auth.schema";
import type { SessionUser } from "@/types/models";

export const authService = {
  login: (input: LoginInput) => api.post<SessionUser>(ApiEndpoint.AuthLogin, input).then((res) => res.data),
  logout: () => api.post(ApiEndpoint.AuthLogout).then(() => undefined),
  me: () => api.get<SessionUser>(ApiEndpoint.AuthMe).then((res) => res.data),
};
