"use client";

import { DockItem } from "@/components/atoms/dock-item";
import { useNavigation } from "@/hooks/use-navigation";

/** Navigasi utama mobile: dock mengambang di bawah layar (maks. 5 menu). Disembunyikan di desktop. */
export function MobileDock() {
  const { dockItems, activeDockRoute, ready } = useNavigation();

  return (
    <nav
      aria-label="Menu utama"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {/* Item muncul setelah role user diketahui, supaya menu admin tidak "loncat" masuk. */}
      <div
        className={`pointer-events-auto flex w-full max-w-md gap-1 rounded-2xl border border-stone-200/80 bg-white/85 p-1.5 shadow-[0_8px_32px_rgb(0_0_0/0.12)] backdrop-blur-lg transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      >
        {dockItems.map((item) => (
          <DockItem key={item.route} item={item} active={item.route === activeDockRoute} />
        ))}
      </div>
    </nav>
  );
}
