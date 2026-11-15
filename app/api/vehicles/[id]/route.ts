import { vehicleSchema } from "@/schemas/customer.schema";
import { parseBody, route } from "@/server/http/handler";
import { deleteVehicle, updateVehicle } from "@/server/services/customer.service";

type P = { id: string };

export const PATCH = route<P>(async ({ req, params, user }) =>
  updateVehicle(params.id, await parseBody(req, vehicleSchema), user.id),
);

export const DELETE = route<P>(async ({ params, user }) => deleteVehicle(params.id, user.id));
