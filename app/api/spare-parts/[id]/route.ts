import { sparePartSchema } from "@/schemas/spare-part.schema";
import { parseBody, route } from "@/server/http/handler";
import { deleteSparePart, getSparePart, updateSparePart } from "@/server/services/spare-part.service";

type P = { id: string };

export const GET = route<P>(async ({ params }) => getSparePart(params.id));

export const PATCH = route<P>(async ({ req, params, user }) =>
  updateSparePart(params.id, await parseBody(req, sparePartSchema), user.id),
);

export const DELETE = route<P>(async ({ params, user }) => deleteSparePart(params.id, user.id));
