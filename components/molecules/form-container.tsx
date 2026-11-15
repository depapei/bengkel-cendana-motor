"use client";

import type { FormEventHandler, ReactNode } from "react";
import { Form } from "antd";

interface FormContainerProps {
  id?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

/** <form> native (state dipegang RHF) + konteks layout vertikal AntD. */
export function FormContainer({ id, onSubmit, children }: FormContainerProps) {
  return (
    <form id={id} onSubmit={onSubmit} noValidate>
      <Form layout="vertical" component={false}>
        {children}
      </Form>
    </form>
  );
}
