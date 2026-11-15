import type { Metadata } from "next";
import { UserManager } from "@/components/organisms/user-manager";

export const metadata: Metadata = { title: "User" };

export default function UsersPage() {
  return <UserManager />;
}
