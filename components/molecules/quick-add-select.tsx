"use client";

import { useState, type ReactNode } from "react";
import { Divider, Select, type SelectProps } from "antd";

interface QuickAddSelectProps<T> extends SelectProps<T> {
  /** Form tambah cepat di bawah daftar opsi; panggil `close` setelah data baru dibuat. */
  renderQuickAdd: (close: () => void) => ReactNode;
}

/** Select yang dropdown-nya punya form tambah data baru. */
export function QuickAddSelect<T>({ renderQuickAdd, ...props }: QuickAddSelectProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <Select<T>
      open={open}
      onOpenChange={setOpen}
      popupRender={(menu) => (
        <>
          {menu}
          <Divider className="my-2" />
          {renderQuickAdd(() => setOpen(false))}
        </>
      )}
      {...props}
    />
  );
}
