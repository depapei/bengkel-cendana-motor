import { ADMIN_ONLY } from "@/constants/user-role";
import { orderExportQuerySchema } from "@/schemas/report.schema";
import { parseQuery, route } from "@/server/http/handler";
import { exportOrderReport } from "@/server/services/report-export.service";

export const GET = route(async ({ req }) => exportOrderReport(parseQuery(req, orderExportQuerySchema)), {
  roles: ADMIN_ONLY,
});
