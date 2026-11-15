"use client";

import { createContext, createElement, useContext, useState, type ReactNode } from "react";

interface ModalPresence {
  open: boolean;
  afterClose: () => void;
}

/** Default `open: true` agar modal yang dirender di luar `useModalState().render` tetap tampil. */
const ModalPresenceContext = createContext<ModalPresence>({ open: true, afterClose: () => {} });

/** Dipakai komponen Modal (`open` + `afterClose`) supaya animasi tutup antd sempat berjalan. */
export function useModalPresence() {
  return useContext(ModalPresenceContext);
}

interface ModalStateValue<T> {
  mounted: boolean;
  open: boolean;
  /** Naik setiap `show` → modal di-remount sehingga defaultValues form selalu segar. */
  key: number;
  record?: T;
}

/**
 * State buka/tutup modal + data yang sedang diedit (undefined = mode tambah).
 *
 * Modal tetap ter-mount selama animasi tutup: `close` hanya mengubah `open` menjadi false,
 * lalu modal di-unmount lewat `afterClose` setelah animasi selesai. Render via `render(...)`.
 */
export function useModalState<T = undefined>() {
  const [state, setState] = useState<ModalStateValue<T>>({ mounted: false, open: false, key: 0 });

  const afterClose = () => setState((s) => (s.open ? s : { ...s, mounted: false, record: undefined }));

  return {
    open: state.open,
    record: state.record,
    show: (record?: T) => setState((s) => ({ mounted: true, open: true, key: s.key + 1, record })),
    close: () => setState((s) => ({ ...s, open: false })),
    render: (node: ReactNode) =>
      state.mounted
        ? createElement(ModalPresenceContext.Provider, { key: state.key, value: { open: state.open, afterClose } }, node)
        : null,
  };
}
