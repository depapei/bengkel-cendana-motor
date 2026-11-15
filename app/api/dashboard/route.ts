import { route } from "@/server/http/handler";
import { getDashboardSummary } from "@/server/services/dashboard.service";

export const GET = route(async () => getDashboardSummary());
