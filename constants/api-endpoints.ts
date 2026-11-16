/**
 * Semua path API (relatif terhadap NEXT_PUBLIC_API_URL).
 * Parameter ditulis `:nama` dan diisi lewat `buildUrl` (utils/url.ts).
 */
export enum ApiEndpoint {
  AuthLogin = "/auth/login",
  AuthLogout = "/auth/logout",
  AuthMe = "/auth/me",

  Customers = "/customers",
  CustomerDetail = "/customers/:id",
  CustomerVehicles = "/customers/:id/vehicles",
  VehicleDetail = "/vehicles/:id",

  Brands = "/brands",
  BrandDetail = "/brands/:id",

  Mechanics = "/mechanics",
  MechanicDetail = "/mechanics/:id",

  SpareParts = "/spare-parts",
  SparePartDetail = "/spare-parts/:id",
  SparePartStockMovements = "/spare-parts/:id/stock-movements",

  Orders = "/orders",
  OrderDetail = "/orders/:id",
  OrderStatus = "/orders/:id/status",
  OrderPayment = "/orders/:id/payment",
  OrderItems = "/orders/:id/items",
  OrderItemDetail = "/orders/:id/items/:itemId",

  Dashboard = "/dashboard",
  ReportOrders = "/reports/orders",
  ReportStockMovements = "/reports/stock-movements",
  ReportOrdersExport = "/reports/orders/export",
  ReportStockMovementsExport = "/reports/stock-movements/export",

  Queue = "/queue",
  QueueDetail = "/queue/:id",

  Users = "/users",
  UserDetail = "/users/:id",
}
