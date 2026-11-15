import { customerCreateSchema } from "@/schemas/customer.schema";
import { listQuerySchema } from "@/schemas/list.schema";
import { parseBody, parseQuery, route } from "@/server/http/handler";
import { createCustomer, listCustomers } from "@/server/services/customer.service";

export const GET = route(async ({ req }) => listCustomers(parseQuery(req, listQuerySchema)));

export const POST = route(async ({ req, user }) => createCustomer(await parseBody(req, customerCreateSchema), user.id));
