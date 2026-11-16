"use client";

import { Button, Tooltip, type ButtonProps, type TooltipProps } from "antd";

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  /** Nama aksi: dipakai sebagai tooltip dan aria-label. */
  label: string;
  tooltipPlacement?: TooltipProps["placement"];
}

/** Tombol ikon-saja. Wajib punya label, karena tanpa teks fungsinya tidak terbaca. */
export function IconButton({ label, tooltipPlacement, size = "large", ...buttonProps }: IconButtonProps) {
  return (
    <Tooltip title={label} placement={tooltipPlacement}>
      <Button size={size} aria-label={label} {...buttonProps} />
    </Tooltip>
  );
}
