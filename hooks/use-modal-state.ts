"use client";

import { useState } from "react";

/** State buka/tutup modal + data yang sedang diedit (undefined = mode tambah). */
export function useModalState<T = undefined>() {
  const [state, setState] = useState<{ open: boolean; record?: T }>({ open: false });
  return {
    open: state.open,
    record: state.record,
    show: (record?: T) => setState({ open: true, record }),
    close: () => setState({ open: false }),
  };
}
