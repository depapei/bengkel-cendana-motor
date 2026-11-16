"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface BackButtonProps {
  /** Halaman tujuan saat tombol diklik (biasanya halaman daftar induknya). */
  href: string;
}

export function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button size="large" icon={<ArrowLeftOutlined />}>Kembali</Button>
    </Link>
  );
}
