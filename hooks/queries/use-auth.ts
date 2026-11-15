"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/constants/query-keys";
import { AppRoute } from "@/constants/routes";
import { UserRole } from "@/constants/user-role";
import { authService } from "@/services/auth.service";
import { useAppMutation } from "../use-app-mutation";

export function useMe() {
  const query = useQuery({ queryKey: queryKeys.auth.me, queryFn: authService.me });
  return { ...query, isAdmin: query.data?.role === UserRole.admin };
}

export function useLogin() {
  const router = useRouter();
  return useAppMutation({
    mutationFn: authService.login,
    invalidate: [queryKeys.auth.me],
    successMessage: false,
    onSuccess: () => router.replace(AppRoute.Home),
  });
}

export function useLogout() {
  return useAppMutation({
    mutationFn: authService.logout,
    successMessage: false,
    // Reload penuh agar seluruh cache React Query ikut bersih.
    onSuccess: () => window.location.assign(AppRoute.Login),
  });
}
