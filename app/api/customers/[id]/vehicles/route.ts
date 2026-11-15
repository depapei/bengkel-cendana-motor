import { vehicleSchema } from "@/schemas/customer.schema";
import { parseBody, route } from "@/server/http/handler";
import { addVehicle } from "@/server/services/customer.service";

export const POST = route<{ id: string }>(async ({ req, params, user }) =>
  addVehicle(params.id, await parseBody(req, vehicleSchema), user.id),
);
