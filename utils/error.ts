import { isAxiosError } from "axios";
import { MESSAGE } from "@/constants/messages";
import type { ApiErrorBody } from "@/types/common";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return MESSAGE.serverError;
}
