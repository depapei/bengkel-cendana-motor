"use client";

import Link from "next/link";
import { Menu, type MenuProps } from "antd";
import { useNavigation } from "@/hooks/use-navigation";

/** Menu sidebar desktop. */
export function AppNavigation() {
  const { items, activeRoute } = useNavigation();

  const menuItems: MenuProps["items"] = items.map((item) => ({
    key: item.route,
    icon: <item.icon />,
    label: <Link href={item.route}>{item.label}</Link>,
  }));

  return <Menu theme="dark" mode="inline" items={menuItems} selectedKeys={activeRoute ? [activeRoute] : []} />;
}
