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
  Reports = "/reports",
  Users = "/users",
}

/** Halaman yang boleh dibuka tanpa login. */
export const PUBLIC_ROUTES: string[] = [AppRoute.Login];
