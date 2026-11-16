"use client";

import { useId, type FormEventHandler, type ReactNode } from "react";
import { Button, Flex } from "antd";
import { FormContainer } from "./form-container";
import { ResponsiveModal } from "./responsive-modal";

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
 * Modal berisi form (Drawer bawah di mobile). Dirender lewat `modal.render(<XxxFormModal/>)` — di-mount
 * saat dibuka (defaultValues RHF selalu segar tanpa reset manual) dan baru di-unmount setelah animasi tutup.
 */
export function FormModal({ title, onSubmit, onCancel, loading, okText = "Simpan", okDanger, width, children }: FormModalProps) {
  const formId = useId();

  return (
    <ResponsiveModal
      title={title}
      width={width}
      onCancel={onCancel}
      footer={
        // Mobile: dua tombol sama lebar memenuhi drawer.
        <Flex justify="end" gap={8}>
          <Button size="large" onClick={onCancel} className="max-lg:flex-1">
            Batal
          </Button>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            form={formId}
            loading={loading}
            danger={okDanger}
            className="max-lg:flex-1"
          >
            {okText}
          </Button>
        </Flex>
      }
    >
      <FormContainer id={formId} onSubmit={onSubmit}>
        {children}
      </FormContainer>
    </ResponsiveModal>
  );
}
