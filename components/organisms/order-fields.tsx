"use client";

import { Col, Input, InputNumber, Row } from "antd";
import { useFormContext, useWatch } from "react-hook-form";
import { DateInput } from "@/components/molecules/date-input";
import { FormField } from "@/components/molecules/form-field";
import { MILEAGE_UNIT } from "@/constants/app";
import { MESSAGE } from "@/constants/messages";
import type { OrderData, OrderInput } from "@/schemas/order.schema";
import { numberInputFormatter, numberInputParser } from "@/utils/format";
import { MechanicSelect } from "./mechanic-select";

/**
 * Field order yang sama untuk form buat & ubah order.
 * Dipakai di dalam <FormProvider> dari useZodForm(orderSchema / orderCreateSchema).
 */
export function OrderFields() {
  const { control, setValue } = useFormContext<
    OrderInput,
    unknown,
    OrderData
  >();
  const mechanicId = useWatch({ control, name: "mechanicId" });

  return (
    <>
      <FormField
        control={control}
        name="complaint"
        label="Keluhan customer"
        required
        render={(field) => (
          <Input.TextArea
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
                onChange={(value) => {
                  field.onChange(value ?? null);
                  // Catatan mekanik hanya berlaku selama ada mekanik yang ditugaskan.
                  if (!value) setValue("mechanicNote", null);
                }}
              />
            )}
          />
        </Col>
      </Row>
      <FormField
        control={control}
        name="mechanicNote"
        label="Catatan internal mekanik"
        extra={!mechanicId && MESSAGE.mechanicRequired}
        render={(field) => (
          <Input.TextArea
            {...field}
            value={field.value ?? ""}
            rows={2}
            disabled={!mechanicId}
            placeholder="Temuan / hasil pengecekan mekanik (tidak tampil di nota)"
          />
        )}
      />
      <FormField
        control={control}
        name="notes"
        label="Catatan bengkel"
        render={(field) => (
          <Input.TextArea
            {...field}
            value={field.value ?? ""}
            rows={2}
            placeholder="Catatan internal (opsional)"
          />
        )}
      />
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <FormField
            control={control}
            name="nextServiceDate"
            label="Service selanjutnya"
            render={(field) => (
              <DateInput
                futureOnly
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Tanggal rekomendasi"
              />
            )}
          />
        </Col>
        <Col xs={24} md={16}>
          <FormField
            control={control}
            name="nextServiceNote"
            label="Rekomendasi service selanjutnya"
            render={(field) => (
              <Input.TextArea
                {...field}
                value={field.value ?? ""}
                autoSize
                placeholder="Contoh: ganti oli & cek kampas rem"
              />
            )}
          />
        </Col>
      </Row>
    </>
  );
}
