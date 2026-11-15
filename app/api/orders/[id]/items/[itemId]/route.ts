import { serviceFeeSchema } from "@/schemas/order.schema";
import { parseBody, route } from "@/server/http/handler";
import { deleteItem, updateItem } from "@/server/services/order.service";

type P = { id: string; itemId: string };

export const PATCH = route<P>(async ({ req, params, user }) =>
  updateItem(params.id, params.itemId, await parseBody(req, serviceFeeSchema), user.id),
);

export const DELETE = route<P>(async ({ params, user }) => deleteItem(params.id, params.itemId, user.id));
