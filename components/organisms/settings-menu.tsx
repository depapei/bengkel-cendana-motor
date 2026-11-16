"use client";

import { LogoutOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { NavList } from "@/components/molecules/nav-list";
import { PageHeader } from "@/components/molecules/page-header";
import { UserIdentity } from "@/components/molecules/user-identity";
import { useLogout, useMe } from "@/hooks/queries/use-auth";
import { useNavigation } from "@/hooks/use-navigation";

/** Halaman Pengaturan: akun yang sedang login + menu yang tidak muat di floating dock. */
export function SettingsMenu() {
  const { data: user } = useMe();
  const { moreItems } = useNavigation();
  const logout = useLogout();

  return (
    <>
      <PageHeader title="Pengaturan" subtitle="Akun & menu lainnya" />
      <Card>
        <UserIdentity user={user} size="large" />
      </Card>
      {moreItems.length > 0 && <NavList title="Menu Lainnya" items={moreItems} />}
      <Button
        size="large"
        danger
        block
        icon={<LogoutOutlined />}
        loading={logout.isPending}
        onClick={() => logout.mutate()}
        className="lg:w-auto lg:self-start"
      >
        Keluar
      </Button>
    </>
  );
}
