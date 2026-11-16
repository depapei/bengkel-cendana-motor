"use client";

import { LogoutOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { UserIdentity } from "@/components/molecules/user-identity";
import { useLogout, useMe } from "@/hooks/queries/use-auth";

/** Menu akun di header desktop. Di mobile, akun & keluar ada di halaman Pengaturan. */
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
      <div className="cursor-pointer">
        <UserIdentity user={user} />
      </div>
    </Dropdown>
  );
}
