import { ApiEndpoint } from "@/constants/api-endpoints";
import type { ExportFormat } from "@/constants/report";
import { api } from "@/lib/axios";
import type {
  DashboardSummary,
  OrderReportFilter,
  OrderReportParams,
  OrderReportSummary,
  ReportOrder,
  ReportPage,
  ReportStockMovement,
  StockReportFilter,
  StockReportParams,
  StockReportSummary,
} from "@/types/report";

/** Filter multi dikirim sebagai CSV (`a,b`) karena API membaca query param tunggal. */
const toCsv = (values?: readonly string[]) => (values?.length ? values.join(",") : undefined);

const orderQuery = ({ status, paymentStatus, ...params }: OrderReportFilter) => ({
  ...params,
  status: toCsv(status),
  paymentStatus: toCsv(paymentStatus),
});
const stockQuery = ({ type, ...params }: StockReportFilter) => ({ ...params, type: toCsv(type) });

const downloadFile = (endpoint: ApiEndpoint, params: object) =>
  api.get<Blob>(endpoint, { params, responseType: "blob" }).then((res) => res.data);

export const reportService = {
  dashboard: () => api.get<DashboardSummary>(ApiEndpoint.Dashboard).then((res) => res.data),
  orders: (params: OrderReportParams) =>
    api
      .get<ReportPage<ReportOrder, OrderReportSummary>>(ApiEndpoint.ReportOrders, { params: orderQuery(params) })
      .then((res) => res.data),
  stockMovements: (params: StockReportParams) =>
    api
      .get<ReportPage<ReportStockMovement, StockReportSummary>>(ApiEndpoint.ReportStockMovements, {
        params: stockQuery(params),
      })
      .then((res) => res.data),
  exportOrders: (filter: OrderReportFilter, format: ExportFormat) =>
    downloadFile(ApiEndpoint.ReportOrdersExport, { ...orderQuery(filter), format }),
  exportStockMovements: (filter: StockReportFilter, format: ExportFormat) =>
    downloadFile(ApiEndpoint.ReportStockMovementsExport, { ...stockQuery(filter), format }),
};
