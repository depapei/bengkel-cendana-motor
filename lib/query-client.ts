import { QueryClient } from "@tanstack/react-query";

const STALE_TIME_MS = 30_000;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: STALE_TIME_MS, retry: 1, refetchOnWindowFocus: false },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** Sesuai guide Next 16: client baru per render di server, satu client dipakai ulang di browser. */
export function getQueryClient() {
  if (typeof window === "undefined") return createQueryClient();
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
