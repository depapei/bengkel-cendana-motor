"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Flex, Typography } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { USER_ROLE_META } from "@/constants/user-role";
import { useLogout, useMe } from "@/hooks/queries/use-auth";

export function UserMenu() {
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items: [{ key: "logout", icon: <LogoutOutlined />, label: "Keluar", danger: true }],
        onClick: () => logout.mutate(),
      }}
    >
      <Flex align="center" gap={8} className="cursor-pointer">
        <Avatar icon={<UserOutlined />} />
        <Typography.Text className="hidden sm:inline">{user?.name}</Typography.Text>
        <StatusTag value={user?.role} meta={USER_ROLE_META} />
      </Flex>
    </Dropdown>
  );
}
