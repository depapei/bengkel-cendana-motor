import { orderStatusChangeSchema } from "@/schemas/order.schema";
import { parseBody, route } from "@/server/http/handler";
import { changeStatus } from "@/server/services/order.service";

export const POST = route<{ id: string }>(async ({ req, params, user }) =>
  changeStatus(params.id, await parseBody(req, orderStatusChangeSchema), user.id),
);
