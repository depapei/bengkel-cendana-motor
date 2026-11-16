"use client";

import { useSyncExternalStore } from "react";
import { MOBILE_MEDIA_QUERY } from "@/constants/app";

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(MOBILE_MEDIA_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/**
 * `true` jika layar di bawah breakpoint `lg`. Untuk UI yang tidak bisa dipilih lewat CSS
 * (mis. Modal vs Drawer). Layout halaman tetap pakai class `lg:` agar tidak berkedip saat hydration.
 */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_MEDIA_QUERY).matches,
    () => false,
  );
}
