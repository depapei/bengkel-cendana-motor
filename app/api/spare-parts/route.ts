import { listQuerySchema } from "@/schemas/list.schema";
import { sparePartCreateSchema } from "@/schemas/spare-part.schema";
import { parseBody, parseQuery, route } from "@/server/http/handler";
import { createSparePart, listSpareParts } from "@/server/services/spare-part.service";

export const GET = route(async ({ req }) => listSpareParts(parseQuery(req, listQuerySchema)));

export const POST = route(async ({ req, user }) => createSparePart(await parseBody(req, sparePartCreateSchema), user.id));
