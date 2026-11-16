/** Path halaman aplikasi. Parameter `:id` diisi lewat `buildUrl`. */
export enum AppRoute {
  Home = "/",
  Login = "/login",
  Orders = "/orders",
  OrderNew = "/orders/new",
  OrderDetail = "/orders/:id",
  OrderInvoice = "/orders/:id/nota",
  Customers = "/customers",
  CustomerDetail = "/customers/:id",
  SpareParts = "/spare-parts",
  SparePartDetail = "/spare-parts/:id",
  Brands = "/brands",
  Mechanics = "/mechanics",
  Reports = "/reports",
  Users = "/users",
  /** Papan antrean servis untuk customer (tanpa login). */
  Queue = "/antrean",
}

/** Halaman khusus tamu: tanpa login, user yang sudah login diarahkan ke Home. */
export const PUBLIC_ROUTES: string[] = [AppRoute.Login];

/** Halaman terbuka: bisa dibuka dengan atau tanpa login. */
export const OPEN_ROUTES: string[] = [AppRoute.Queue];
