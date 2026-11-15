import { listQuerySchema } from "@/schemas/list.schema";
import { stockMovementSchema } from "@/schemas/spare-part.schema";
import { parseBody, parseQuery, route } from "@/server/http/handler";
import { createStockMovement, listStockMovements } from "@/server/services/spare-part.service";

type P = { id: string };

export const GET = route<P>(async ({ req, params }) => listStockMovements(params.id, parseQuery(req, listQuerySchema)));

export const POST = route<P>(async ({ req, params, user }) =>
  createStockMovement(params.id, await parseBody(req, stockMovementSchema), user.id),
);
