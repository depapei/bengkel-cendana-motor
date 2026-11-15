import { ADMIN_ONLY } from "@/constants/user-role";
import { orderReportQuerySchema } from "@/schemas/report.schema";
import { parseQuery, route } from "@/server/http/handler";
import { getOrderReport } from "@/server/services/report.service";

export const GET = route(async ({ req }) => getOrderReport(parseQuery(req, orderReportQuerySchema)), {
  roles: ADMIN_ONLY,
});
