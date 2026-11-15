"use client";

import { App } from "antd";
import { getErrorMessage } from "@/utils/error";

/** Satu-satunya cara menampilkan notifikasi sukses/error. */
export function useNotify() {
  const { message } = App.useApp();
  return {
    success: (text: string) => message.success(text),
    error: (error: unknown) => message.error(getErrorMessage(error)),
  };
}
