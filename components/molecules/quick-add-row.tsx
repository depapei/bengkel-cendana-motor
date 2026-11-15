"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";

interface QuickAddRowProps {
  onSubmit: () => void;
  loading?: boolean;
  /** Field input (FormField) yang tampil sebelum tombol Tambah. */
  children: ReactNode;
}

/**
 * Baris form mini "tambah cepat" di dalam dropdown Select.
 * Sengaja tanpa <form>: dropdown di-portal tapi event React tetap bubble
 * ke form induk, jadi submit ditangani manual lewat Enter / tombol.
 */
export function QuickAddRow({ onSubmit, loading, children }: QuickAddRowProps) {
  // Cegah Select induk menangkap tombol keyboard (spasi, panah, Enter).
  const handleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Flex gap={8} align="flex-start" className="px-2 pt-2 pb-1" onKeyDown={handleKeyDown}>
      {children}
      <Button type="primary" icon={<PlusOutlined />} loading={loading} onClick={onSubmit}>
        Tambah
      </Button>
    </Flex>
  );
}
