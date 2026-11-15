import { orderListQuerySchema } from "@/schemas/list.schema";
import { orderCreateSchema } from "@/schemas/order.schema";
import { parseBody, parseQuery, route } from "@/server/http/handler";
import { createOrder, listOrders } from "@/server/services/order.service";

export const GET = route(async ({ req }) => listOrders(parseQuery(req, orderListQuerySchema)));

export const POST = route(async ({ req, user }) => createOrder(await parseBody(req, orderCreateSchema), user.id));
