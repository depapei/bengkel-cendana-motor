import type { Metadata } from "next";
import { QueueBoard } from "@/components/organisms/queue-board";
import { PublicLayout } from "@/components/templates/public-layout";

export const metadata: Metadata = { title: "Antrean Servis" };

export default function QueuePage() {
  return (
    <PublicLayout>
      <QueueBoard />
    </PublicLayout>
  );
}
