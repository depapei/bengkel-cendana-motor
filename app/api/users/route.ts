import { ADMIN_ONLY } from "@/constants/user-role";
import { userCreateSchema } from "@/schemas/user.schema";
import { parseBody, route } from "@/server/http/handler";
import { createUser, listUsers } from "@/server/services/user.service";

export const GET = route(async () => listUsers(), { roles: ADMIN_ONLY });

export const POST = route(async ({ req, user }) => createUser(await parseBody(req, userCreateSchema), user.id), {
  roles: ADMIN_ONLY,
});
