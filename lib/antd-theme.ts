import type { ThemeConfig } from "antd";

export const BRAND_COLOR = "#D3241C";
export const SIDEBAR_BG = "#1c1917";
/** Latar halaman; dipakai juga sebagai `theme-color` browser mobile. */
export const PAGE_BG = "#f5f5f4";

/** Satu-satunya tempat mengatur tema Ant Design. */
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND_COLOR,
    colorInfo: BRAND_COLOR,
    borderRadius: 8,
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
  components: {
    Layout: { siderBg: SIDEBAR_BG, headerBg: "#ffffff", bodyBg: PAGE_BG },
    Menu: { darkItemBg: SIDEBAR_BG, darkSubMenuItemBg: SIDEBAR_BG, darkItemSelectedBg: BRAND_COLOR },
  },
};
