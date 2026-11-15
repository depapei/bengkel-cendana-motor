"use client";

import { useId, type FormEventHandler, type ReactNode } from "react";
import { Modal } from "antd";
import { FormContainer } from "./form-container";

interface FormModalProps {
  title: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  loading?: boolean;
  okText?: string;
  okDanger?: boolean;
  width?: number;
  children: ReactNode;
}

/**
 * Modal berisi form. Dirender hanya saat dibuka (`{modal.open && <XxxFormModal/>}`)
 * sehingga defaultValues RHF selalu segar tanpa reset manual.
 */
export function FormModal({ title, onSubmit, onCancel, loading, okText = "Simpan", okDanger, width, children }: FormModalProps) {
  const formId = useId();
  return (
    <Modal
      open
      title={title}
      width={width}
      onCancel={onCancel}
      okText={okText}
      cancelText="Batal"
      confirmLoading={loading}
      okButtonProps={{ htmlType: "submit", form: formId, danger: okDanger }}
      destroyOnHidden
    >
      <FormContainer id={formId} onSubmit={onSubmit}>
        {children}
      </FormContainer>
    </Modal>
  );
}
