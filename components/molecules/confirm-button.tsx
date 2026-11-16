"use client";

import type { ReactNode } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, type ButtonProps } from "antd";
import { IconButton } from "@/components/atoms/icon-button";

interface ConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
  confirmTitle: ReactNode;
  onConfirm: () => void;
  /** Label tooltip saat tombol tanpa teks (ikon saja). */
  label?: string;
}

/** Tombol dengan konfirmasi. Default: tombol hapus. */
export function ConfirmButton({
  confirmTitle,
  onConfirm,
  children,
  label = "Hapus",
  danger = true,
  icon = <DeleteOutlined />,
  ...buttonProps
}: ConfirmButtonProps) {
  return (
    <Popconfirm title={confirmTitle} onConfirm={onConfirm} okText="Ya" cancelText="Batal">
      {children ? (
        <Button size="large" danger={danger} icon={icon} {...buttonProps}>
          {children}
        </Button>
      ) : (
        <IconButton label={label} danger={danger} icon={icon} {...buttonProps} />
      )}
    </Popconfirm>
  );
}
