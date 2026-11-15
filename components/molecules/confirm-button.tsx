"use client";

import type { ReactNode } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, type ButtonProps } from "antd";

interface ConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
  confirmTitle: ReactNode;
  onConfirm: () => void;
}

/** Tombol dengan konfirmasi. Default: tombol hapus. */
export function ConfirmButton({
  confirmTitle,
  onConfirm,
  children,
  danger = true,
  icon = <DeleteOutlined />,
  ...buttonProps
}: ConfirmButtonProps) {
  return (
    <Popconfirm title={confirmTitle} onConfirm={onConfirm} okText="Ya" cancelText="Batal">
      <Button danger={danger} icon={icon} {...buttonProps}>
        {children}
      </Button>
    </Popconfirm>
  );
}
