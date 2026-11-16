import { mechanicUpdateSchema } from "@/schemas/mechanic.schema";
import { parseBody, route } from "@/server/http/handler";
import { updateMechanic } from "@/server/services/mechanic.service";

type P = { id: string };

export const PATCH = route<P>(async ({ req, params, user }) =>
  updateMechanic(params.id, await parseBody(req, mechanicUpdateSchema), user.id),
);
