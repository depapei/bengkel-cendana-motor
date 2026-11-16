import type { Metadata } from "next";
import { SettingsMenu } from "@/components/organisms/settings-menu";

export const metadata: Metadata = { title: "Pengaturan" };

export default function SettingsPage() {
  return <SettingsMenu />;
}
