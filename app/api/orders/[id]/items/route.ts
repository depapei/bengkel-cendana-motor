import { serviceFeeSchema } from "@/schemas/order.schema";
import { parseBody, route } from "@/server/http/handler";
import { addItem } from "@/server/services/order.service";

export const POST = route<{ id: string }>(async ({ req, params, user }) =>
  addItem(params.id, await parseBody(req, serviceFeeSchema), user.id),
);
