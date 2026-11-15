import { ADMIN_ONLY } from "@/constants/user-role";
import { stockExportQuerySchema } from "@/schemas/report.schema";
import { parseQuery, route } from "@/server/http/handler";
import { exportStockReport } from "@/server/services/report-export.service";

export const GET = route(async ({ req }) => exportStockReport(parseQuery(req, stockExportQuerySchema)), {
  roles: ADMIN_ONLY,
});
