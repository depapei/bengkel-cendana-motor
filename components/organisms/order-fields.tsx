"use client";

import { Col, Input, InputNumber, Row } from "antd";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/molecules/form-field";
import { MILEAGE_UNIT } from "@/constants/app";
import type { OrderData, OrderInput } from "@/schemas/order.schema";
import { numberInputFormatter, numberInputParser } from "@/utils/format";
import { MechanicSelect } from "./mechanic-select";

/**
 * Field detail service untuk form order baru (catatan mekanik & service selanjutnya diisi di halaman detail order).
 * Dipakai di dalam <FormProvider> dari useZodForm(orderSchema / orderCreateSchema).
 */
export function OrderFields() {
  const { control } = useFormContext<
    OrderInput,
    unknown,
    OrderData
  >();

  return (
    <>
      <FormField
        control={control}
        name="complaint"
        label="Keluhan customer"
        required
        render={(field) => (
          <Input.TextArea
            size="large"
            {...field}
            rows={3}
            placeholder="Contoh: rem depan bunyi, tarikan berat"
          />
        )}
      />
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <FormField
            control={control}
            name="mileage"
            label="Kilometer motor"
            required
            render={(field) => (
              <InputNumber<number>
                size="large"
                {...field}
                value={field.value ?? null}
                min={0}
                className="w-full"
                suffix={MILEAGE_UNIT}
                placeholder="Contoh: 12.500"
                formatter={numberInputFormatter}
                parser={numberInputParser}
              />
            )}
          />
        </Col>
        <Col xs={24} md={12}>
          <FormField
            control={control}
            name="mechanicId"
            label="Mekanik"
            render={(field) => (
              <MechanicSelect
                value={field.value ?? undefined}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value ?? null)}
              />
            )}
          />
        </Col>
      </Row>
      <FormField
        control={control}
        name="notes"
        label="Catatan bengkel"
        render={(field) => (
          <Input.TextArea
            size="large"
            {...field}
            value={field.value ?? ""}
            rows={2}
            placeholder="Catatan internal (opsional)"
          />
        )}
      />
    </>
  );
}
