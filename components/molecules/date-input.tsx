"use client";

import dayjs, { type Dayjs } from "dayjs";
import { DatePicker, type DatePickerProps } from "antd";
import { DATE_FORMAT, DATE_ONLY_FORMAT } from "@/constants/app";

interface DateInputProps extends Pick<DatePickerProps, "placeholder" | "disabled" | "onBlur" | "allowClear"> {
  /** Tanggal `YYYY-MM-DD`. */
  value?: string | null;
  onChange?: (value: string | null) => void;
  /** Tanggal sebelum hari ini tidak bisa dipilih. */
  futureOnly?: boolean;
}

/** DatePicker dengan nilai string `YYYY-MM-DD`, cocok untuk form & schema zod. */
export function DateInput({ value, onChange, futureOnly, ...props }: DateInputProps) {
  return (
    <DatePicker
      className="w-full"
      format={DATE_FORMAT}
      value={value ? dayjs(value) : null}
      onChange={(date: Dayjs | null) => onChange?.(date ? date.format(DATE_ONLY_FORMAT) : null)}
      disabledDate={futureOnly ? (date) => date.isBefore(dayjs(), "day") : undefined}
      {...props}
    />
  );
}
