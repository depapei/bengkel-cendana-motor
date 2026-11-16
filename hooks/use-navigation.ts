"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from "@/constants/navigation";
import { AppRoute } from "@/constants/routes";
import { useMe } from "@/hooks/queries/use-auth";

/** Home ("/") harus cocok persis, karena semua path diawali "/". */
const isRouteActive = (pathname: string, route: AppRoute) =>
  route === AppRoute.Home ? pathname === route : pathname.startsWith(route);

/** Menu yang boleh dilihat user + menu aktif untuk sidebar desktop & dock mobile. */
export function useNavigation() {
  const pathname = usePathname();
  const { isAdmin, isPending } = useMe();

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);
  const moreItems = items.filter((item) => !item.dock);
  const dockItems = [...items.filter((item) => item.dock), SETTINGS_NAV_ITEM];

  const activeRoute = [...items, SETTINGS_NAV_ITEM].find((item) => isRouteActive(pathname, item.route))?.route;
  // Halaman dari menu "lainnya" (mis. Customer) dibuka lewat Pengaturan → tab Pengaturan ikut aktif.
  const activeDockRoute = moreItems.some((item) => item.route === activeRoute) ? SETTINGS_NAV_ITEM.route : activeRoute;

  return { items, moreItems, dockItems, activeRoute, activeDockRoute, ready: !isPending };
}
