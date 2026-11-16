"use client";

import { useId, type FormEventHandler, type ReactNode } from "react";
import { Modal } from "antd";
import { useModalPresence } from "@/hooks/use-modal-state";
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
 * Modal berisi form. Dirender lewat `modal.render(<XxxFormModal/>)` — di-mount saat dibuka
 * (defaultValues RHF selalu segar tanpa reset manual) dan baru di-unmount setelah animasi tutup.
 */
export function FormModal({ title, onSubmit, onCancel, loading, okText = "Simpan", okDanger, width, children }: FormModalProps) {
  const formId = useId();
  const { open, afterClose } = useModalPresence();
  return (
    <Modal
      open={open}
      afterClose={afterClose}
      title={title}
      width={width}
      onCancel={onCancel}
      okText={okText}
      cancelText="Batal"
      confirmLoading={loading}
      okButtonProps={{ size: "large", htmlType: "submit", form: formId, danger: okDanger }}
      cancelButtonProps={{ size: "large" }}
    >
      <FormContainer id={formId} onSubmit={onSubmit}>
        {children}
      </FormContainer>
    </Modal>
  );
}
