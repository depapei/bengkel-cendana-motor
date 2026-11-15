"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Typography } from "antd";
import { AppLogo } from "@/components/atoms/app-logo";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/constants/app";
import authWorkshopImage from "@/public/images/auth-silhouette.webp";

interface AuthLayoutProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const [firstWord, ...restWords] = APP_NAME.split(" ");

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-[#f6e4df] lg:grid-cols-[1.1fr_1fr]">
      <Image
        src={authWorkshopImage}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-bottom"
      />
      {/* Gradasi terang dari kiri-atas agar wording tetap terbaca di atas gambar. */}
      <div className="absolute inset-0 bg-linear-to-br from-[#f8ebe7] via-[#f8ebe7]/60 via-35% to-transparent to-60%" />

      <section className="relative hidden lg:block">
        <div className="flex h-full flex-col p-12 xl:p-16">
          <AppLogo />
          <div className="mt-12 max-w-lg">
            <span className="mb-4 block h-1 w-16 rounded-full bg-red-600" />
            <h1 className="text-6xl leading-none font-black tracking-tight text-stone-900 uppercase xl:text-7xl">
              {firstWord}
              <span className="block text-red-700">{restWords.join(" ")}</span>
            </h1>
            <p className="mt-6 text-lg font-semibold text-red-900">{APP_TAGLINE}</p>
            <p className="mt-2 text-sm text-stone-600">{APP_DESCRIPTION}</p>
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm shadow p-8 rounded-2xl bg-white">
          <div className="mb-10 lg:hidden">
            <AppLogo />
          </div>
          <Typography.Title level={2} className="mb-1">
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Paragraph type="secondary" className="mb-8">
              {subtitle}
            </Typography.Paragraph>
          )}
          {children}
          <Typography.Paragraph type="secondary" className="mt-10 mb-0 text-center text-xs">
            © {new Date().getFullYear()} {APP_NAME}
          </Typography.Paragraph>
        </div>
      </section>
    </main>
  );
}
