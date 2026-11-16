import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { APP_NAME } from "@/constants/app";
import { PAGE_BG } from "@/lib/antd-theme";
import { AppProvider } from "@/providers/app-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: "Sistem pencatatan order servis Bengkel Cendana Motor",
};

/** `cover` → halaman memakai seluruh layar; area notch/home indicator diatur lewat env(safe-area-inset-*). */
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: PAGE_BG,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        {/* AntD CSS-in-JS memakai Math.random() → wajib dirender saat request (Cache Components). */}
        <Suspense>
          <AppProvider>{children}</AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
