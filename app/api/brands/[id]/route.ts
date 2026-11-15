import { brandSchema } from "@/schemas/brand.schema";
import { parseBody, route } from "@/server/http/handler";
import { deleteBrand, updateBrand } from "@/server/services/brand.service";

type P = { id: string };

export const PATCH = route<P>(async ({ req, params, user }) =>
  updateBrand(params.id, await parseBody(req, brandSchema), user.id),
);

export const DELETE = route<P>(async ({ params, user }) => deleteBrand(params.id, user.id));
