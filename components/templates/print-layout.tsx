import type { ReactNode } from "react";

/** Kerangka halaman cetak (nota): tanpa sidebar, lebar kertas. */
export function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 py-10 print:bg-white print:py-0">
      <main className="mx-auto max-w-3xl rounded-xl bg-white p-10 shadow-sm print:max-w-none print:rounded-none print:p-0 print:shadow-none">
        {children}
      </main>
    </div>
  );
}
