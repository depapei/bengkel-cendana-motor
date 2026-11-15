import { orderSchema } from "@/schemas/order.schema";
import { parseBody, route } from "@/server/http/handler";
import { getOrder, updateOrder } from "@/server/services/order.service";

type P = { id: string };

export const GET = route<P>(async ({ params }) => getOrder(params.id));

export const PATCH = route<P>(async ({ req, params, user }) =>
  updateOrder(params.id, await parseBody(req, orderSchema), user.id),
);
