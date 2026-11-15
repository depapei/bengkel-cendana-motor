import { customerSchema } from "@/schemas/customer.schema";
import { parseBody, route } from "@/server/http/handler";
import { deleteCustomer, getCustomer, updateCustomer } from "@/server/services/customer.service";

type P = { id: string };

export const GET = route<P>(async ({ params }) => getCustomer(params.id));

export const PATCH = route<P>(async ({ req, params, user }) =>
  updateCustomer(params.id, await parseBody(req, customerSchema), user.id),
);

export const DELETE = route<P>(async ({ params, user }) => deleteCustomer(params.id, user.id));
