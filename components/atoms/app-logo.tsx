"use client";

import { ToolOutlined } from "@ant-design/icons";
import { APP_NAME } from "@/constants/app";

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
      <ToolOutlined />
      {!iconOnly && <span className="truncate">{APP_NAME}</span>}
    </span>
  );
}
