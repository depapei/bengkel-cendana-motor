"use client";

import Image from "next/image";
import { APP_NAME } from "@/constants/app";
import logoImage from "@/public/logo.webp";

const LOGO_SIZE = 32;

interface AppLogoProps {
  inverted?: boolean;
  /** Tampilkan ikon saja, mis. saat sidebar diciutkan. */
  iconOnly?: boolean;
}

export function AppLogo({ inverted, iconOnly }: AppLogoProps) {
  return (
    <span
      className={`flex items-center gap-2 text-lg font-semibold ${inverted ? "text-white" : "text-stone-900"}`}
      title={iconOnly ? APP_NAME : undefined}
    >
      <Image src={logoImage} alt={APP_NAME} width={LOGO_SIZE} height={LOGO_SIZE} loading="eager" className="shrink-0" />
      {!iconOnly && <span className="truncate">{APP_NAME}</span>}
    </span>
  );
}
