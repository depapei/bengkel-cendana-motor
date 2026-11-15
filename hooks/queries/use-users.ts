"use client";

import { useQuery } from "@tanstack/react-query";
import { MESSAGE } from "@/constants/messages";
import { queryKeys } from "@/constants/query-keys";
import type { UserCreateInput } from "@/schemas/user.schema";
import { userService } from "@/services/user.service";
import { useAppMutation } from "../use-app-mutation";

const invalidate = [queryKeys.users.all];

export function useUsers(enabled: boolean) {
  return useQuery({ queryKey: queryKeys.users.all, queryFn: () => userService.list(), enabled });
}

export function useSaveUser(id?: string, onSuccess?: () => void) {
  return useAppMutation({
    mutationFn: (input: UserCreateInput) => (id ? userService.update(id, input) : userService.create(input)),
    invalidate,
    onSuccess,
  });
}

export function useDeleteUser() {
  return useAppMutation({ mutationFn: userService.remove, invalidate, successMessage: MESSAGE.deleted });
}
