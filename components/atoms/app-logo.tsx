"use client";

import { ToolOutlined } from "@ant-design/icons";
import { APP_NAME } from "@/constants/app";

interface AppLogoProps {
  inverted?: boolean;
}

export function AppLogo({ inverted }: AppLogoProps) {
  return (
    <span className={`flex items-center gap-2 text-lg font-semibold ${inverted ? "text-white" : "text-stone-900"}`}>
      <ToolOutlined />
      {APP_NAME}
    </span>
  );
}
