"use client";

import dayjs, { type Dayjs } from "dayjs";
import { DatePicker } from "antd";
import { DATE_FORMAT } from "@/constants/app";
import type { DateRange } from "@/types/report";

type Range = [Dayjs, Dayjs];

const PRESETS: { label: string; value: Range }[] = [
  { label: "Hari ini", value: [dayjs(), dayjs()] },
  { label: "7 hari terakhir", value: [dayjs().subtract(6, "day"), dayjs()] },
  { label: "Bulan ini", value: [dayjs().startOf("month"), dayjs().endOf("month")] },
  {
    label: "Bulan lalu",
    value: [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")],
  },
];

/** Rentang bulan berjalan (awal s/d akhir bulan), sebagai default laporan. */
export const currentMonthRange = (): DateRange => toDateRange([dayjs().startOf("month"), dayjs().endOf("month")]);

/** Awal hari `from` s/d akhir hari `to` (zona waktu browser), dalam ISO. */
function toDateRange([from, to]: Range): DateRange {
  return { from: from.startOf("day").toISOString(), to: to.endOf("day").toISOString() };
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

/** Input rentang tanggal dengan preset cepat. */
export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <DatePicker.RangePicker
      allowClear={false}
      format={DATE_FORMAT}
      presets={PRESETS}
      value={[dayjs(value.from), dayjs(value.to)]}
      onChange={(range) => {
        if (range?.[0] && range[1]) onChange(toDateRange([range[0], range[1]]));
      }}
    />
  );
}
