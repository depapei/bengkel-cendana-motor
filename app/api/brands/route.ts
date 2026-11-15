import { brandSchema } from "@/schemas/brand.schema";
import { parseBody, route } from "@/server/http/handler";
import { createBrand, listBrands } from "@/server/services/brand.service";

export const GET = route(async () => listBrands());

export const POST = route(async ({ req, user }) => createBrand(await parseBody(req, brandSchema), user.id));
