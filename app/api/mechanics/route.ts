import { mechanicSchema } from "@/schemas/mechanic.schema";
import { parseBody, route } from "@/server/http/handler";
import { createMechanic, listMechanics } from "@/server/services/mechanic.service";

export const GET = route(async () => listMechanics());

export const POST = route(async ({ req, user }) => createMechanic(await parseBody(req, mechanicSchema), user.id));
