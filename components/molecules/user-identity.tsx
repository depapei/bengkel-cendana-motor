"use client";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Typography } from "antd";
import { StatusTag } from "@/components/atoms/status-tag";
import { USER_ROLE_META } from "@/constants/user-role";
import type { SessionUser } from "@/types/models";

const LARGE_AVATAR_SIZE = 56;

interface UserIdentityProps {
  user?: SessionUser;
  /** `compact`: satu baris (header desktop). `large`: avatar besar + username (halaman Pengaturan). */
  size?: "compact" | "large";
}

/** Avatar + nama + role user yang sedang login. */
export function UserIdentity({ user, size = "compact" }: UserIdentityProps) {
  if (size === "compact") {
    return (
      <Flex align="center" gap={8}>
        <Avatar icon={<UserOutlined />} />
        <Typography.Text>{user?.name}</Typography.Text>
        <StatusTag value={user?.role} meta={USER_ROLE_META} />
      </Flex>
    );
  }

  return (
    <Flex align="center" gap={16}>
      <Avatar size={LARGE_AVATAR_SIZE} icon={<UserOutlined />} className="shrink-0" />
      <Flex vertical gap={4} className="min-w-0">
        <Typography.Text strong className="truncate text-base">
          {user?.name}
        </Typography.Text>
        <Flex align="center" gap={8} wrap>
          {user && <Typography.Text type="secondary">@{user.username}</Typography.Text>}
          <StatusTag value={user?.role} meta={USER_ROLE_META} />
        </Flex>
      </Flex>
    </Flex>
  );
}
