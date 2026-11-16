export const APP_NAME = "Cendana Motor";
export const APP_TAGLINE = "Bengkel servis & spare part motor terpercaya.";
export const APP_DESCRIPTION = "Kelola order servis, stok sparepart, dan pembayaran dalam satu tempat.";
export const APP_TIMEZONE = "Asia/Jakarta";
export const APP_LOCALE = "id-ID";
export const CURRENCY = "IDR";

export const SESSION_COOKIE = "cm_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 jam

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;
export const SEARCH_DEBOUNCE_MS = 400;
/** Papan antrean customer di-refresh otomatis tiap interval ini. */
export const QUEUE_REFRESH_INTERVAL_MS = 30_000;

/** Sparepart dianggap stok menipis jika stok <= angka ini. */
export const LOW_STOCK_THRESHOLD = 5;
/** Jumlah sparepart stok menipis yang ditampilkan di dashboard. */
export const LOW_STOCK_LIMIT = 10;
/** Jumlah order terbaru yang ditampilkan di dashboard. */
export const RECENT_ORDERS_LIMIT = 5;

export const WHATSAPP_BASE_URL = "https://wa.me";

export const DATE_FORMAT = "DD MMM YYYY";
/** Format tanggal tanpa jam untuk dikirim ke API (kolom @db.Date). */
export const DATE_ONLY_FORMAT = "YYYY-MM-DD";
export const MILEAGE_UNIT = "km";
export const DATE_TIME_FORMAT = "DD MMM YYYY HH:mm";

/** Sama dengan breakpoint `lg` Tailwind: di bawah lebar ini aplikasi memakai layout mobile. */
export const MOBILE_MEDIA_QUERY = "(max-width: 1023.98px)";
