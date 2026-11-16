"use client";

import type { ReactNode } from "react";
import { Drawer, Modal } from "antd";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useModalPresence } from "@/hooks/use-modal-state";

interface ResponsiveModalProps {
  title: ReactNode;
  onCancel: () => void;
  /** Tombol aksi di bawah; kosong = tanpa footer. */
  footer?: ReactNode;
  /** Lebar modal desktop. */
  width?: number;
  children: ReactNode;
}

/**
 * Desktop: Modal di tengah layar. Mobile: Drawer dari bawah selebar layar (bottom sheet).
 * Buka/tutup + unmount setelah animasi mengikuti `useModalState().render(...)`.
 */
export function ResponsiveModal({ title, onCancel, footer, width, children }: ResponsiveModalProps) {
  const isMobile = useIsMobile();
  const { open, afterClose } = useModalPresence();

  if (isMobile) {
    return (
      <Drawer
        open={open}
        placement="bottom"
        size="auto"
        title={title}
        onClose={onCancel}
        afterOpenChange={(opened) => !opened && afterClose()}
        footer={footer}
        classNames={{
          wrapper: "max-h-[92dvh]",
          section: "rounded-t-2xl",
          body: "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
          footer: "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        }}
      >
        {children}
      </Drawer>
    );
  }

  return (
    <Modal open={open} afterClose={afterClose} title={title} width={width} onCancel={onCancel} footer={footer ?? null}>
      {children}
    </Modal>
  );
}
