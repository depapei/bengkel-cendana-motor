import { NextResponse } from "next/server";
import { loginSchema } from "@/schemas/auth.schema";
import { setSessionCookie } from "@/server/auth";
import { parseBody, publicRoute } from "@/server/http/handler";
import { login } from "@/server/services/user.service";

export const POST = publicRoute(async ({ req }) => {
  const user = await login(await parseBody(req, loginSchema));
  const res = NextResponse.json(user);
  await setSessionCookie(res, user.id);
  return res;
});
