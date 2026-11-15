"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { MESSAGE } from "@/constants/messages";
import { useNotify } from "./use-notify";

interface AppMutationOptions<TData, TVars> {
  mutationFn: (vars: TVars) => Promise<TData>;
  /** Query yang di-invalidate setelah sukses. */
  invalidate?: QueryKey[];
  /** `false` = tanpa notifikasi sukses. */
  successMessage?: string | false;
  onSuccess?: (data: TData, vars: TVars) => void;
}

/** useMutation + invalidate + notifikasi standar. */
export function useAppMutation<TData, TVars = void>({
  mutationFn,
  invalidate = [],
  successMessage = MESSAGE.saved,
  onSuccess,
}: AppMutationOptions<TData, TVars>) {
  const queryClient = useQueryClient();
  const notify = useNotify();

  return useMutation({
    mutationFn,
    onSuccess: async (data, vars) => {
      await Promise.all(invalidate.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
      if (successMessage) notify.success(successMessage);
      onSuccess?.(data, vars);
    },
    onError: notify.error,
  });
}
