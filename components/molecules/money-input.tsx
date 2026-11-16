"use client";

import { InputNumber, type InputNumberProps } from "antd";
import { numberInputFormatter, numberInputParser } from "@/utils/format";

/** InputNumber Rupiah dengan pemisah ribuan. */
export function MoneyInput(props: InputNumberProps<number>) {
  return (
    <InputNumber<number>
      size="large"
      min={0}
      prefix="Rp"
      className="w-full"
      formatter={numberInputFormatter}
      parser={numberInputParser}
      {...props}
    />
  );
}
