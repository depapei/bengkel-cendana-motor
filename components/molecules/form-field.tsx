"use client";

import type { ReactElement, ReactNode } from "react";
import { Form } from "antd";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface FormFieldProps<T extends FieldValues, TName extends Path<T>, TOut extends FieldValues> {
  control: Control<T, unknown, TOut>;
  name: TName;
  label?: ReactNode;
  required?: boolean;
  extra?: ReactNode;
  className?: string;
  render: (field: ControllerRenderProps<T, TName>) => ReactElement;
}

/** Satu-satunya penghubung React Hook Form ↔ input Ant Design. */
export function FormField<T extends FieldValues, TName extends Path<T>, TOut extends FieldValues = T>({
  control,
  name,
  label,
  required,
  extra,
  className,
  render,
}: FormFieldProps<T, TName, TOut>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          required={required}
          extra={extra}
          className={className}
          validateStatus={fieldState.error ? "error" : undefined}
          help={fieldState.error?.message}
        >
          {render(field)}
        </Form.Item>
      )}
    />
  );
}
