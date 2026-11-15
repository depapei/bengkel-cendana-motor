import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/server/auth";
import { publicRoute } from "@/server/http/handler";

export const POST = publicRoute(async () => {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
});
