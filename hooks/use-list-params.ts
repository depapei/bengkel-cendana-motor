"use client";

import { useState } from "react";
import type { TablePaginationConfig } from "antd";
import { DEFAULT_PAGE_SIZE } from "@/constants/app";
import type { ListParams } from "@/types/common";

/** State halaman + filter untuk tabel server-side. */
export function useListParams<T extends ListParams>(initial: Omit<T, keyof ListParams> & ListParams = {} as T) {
  const [params, setParams] = useState<T>({ page: 1, pageSize: DEFAULT_PAGE_SIZE, ...initial } as T);

  const setFilter = (patch: Partial<T>) => setParams((current) => ({ ...current, ...patch, page: 1 }));

  const pagination = (total?: number): TablePaginationConfig => ({
    current: params.page,
    pageSize: params.pageSize,
    total,
    showSizeChanger: true,
    onChange: (page, pageSize) => setParams((current) => ({ ...current, page, pageSize })),
  });

  return { params, setFilter, pagination };
}

/** State daftar dari `useListParams`, untuk dioper ke komponen anak. */
export type ListState<T extends ListParams> = ReturnType<typeof useListParams<T>>;
