import { ADMIN_ONLY } from "@/constants/user-role";
import { userUpdateSchema } from "@/schemas/user.schema";
import { parseBody, route } from "@/server/http/handler";
import { deleteUser, updateUser } from "@/server/services/user.service";

type P = { id: string };

export const PATCH = route<P>(
  async ({ req, params, user }) => updateUser(params.id, await parseBody(req, userUpdateSchema), user.id),
  { roles: ADMIN_ONLY },
);

export const DELETE = route<P>(async ({ params, user }) => deleteUser(params.id, user.id), { roles: ADMIN_ONLY });
