"use client";

import type { ReactNode } from "react";
import { Result, Skeleton } from "antd";
import { getErrorMessage } from "@/utils/error";

interface QueryStateProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
  children: (data: T) => ReactNode;
}

/** Tampilan loading / error standar untuk satu query detail. */
export function QueryState<T>({ data, isLoading, error, children }: QueryStateProps<T>) {
  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (error || !data) return <Result status="warning" title={getErrorMessage(error)} />;
  return children(data);
}
