import { paymentSchema } from "@/schemas/order.schema";
import { parseBody, route } from "@/server/http/handler";
import { recordPayment } from "@/server/services/order.service";

export const POST = route<{ id: string }>(async ({ req, params, user }) =>
  recordPayment(params.id, await parseBody(req, paymentSchema), user.id),
);
