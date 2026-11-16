"use client";

import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { ViewMode } from "@/constants/view-mode";

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

const OPTIONS = [
  { value: ViewMode.Card, icon: <AppstoreOutlined />, title: "Card" },
  { value: ViewMode.Table, icon: <UnorderedListOutlined />, title: "Tabel" },
];

/** Pengalih tampilan daftar: card / tabel. Hanya desktop — mobile selalu card. */
export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return <Segmented<ViewMode> size="large" options={OPTIONS} value={value} onChange={onChange} className="max-lg:hidden" />;
}
