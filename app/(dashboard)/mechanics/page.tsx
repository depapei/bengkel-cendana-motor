import type { Metadata } from "next";
import { MechanicManager } from "@/components/organisms/mechanic-manager";

export const metadata: Metadata = { title: "Mekanik" };

export default function MechanicsPage() {
  return <MechanicManager />;
}
