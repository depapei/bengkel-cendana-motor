import { ADMIN_ONLY } from "@/constants/user-role";
import { stockReportQuerySchema } from "@/schemas/report.schema";
import { parseQuery, route } from "@/server/http/handler";
import { getStockReport } from "@/server/services/report.service";

export const GET = route(async ({ req }) => getStockReport(parseQuery(req, stockReportQuerySchema)), {
  roles: ADMIN_ONLY,
});
