import "server-only";
import type { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/constants/app";
import type { UserRole } from "@/constants/user-role";
import { signSessionToken, verifySessionToken } from "@/lib/session-token";
import type { SessionUser } from "@/types/models";
import { notDeleted } from "./audit";
import { db } from "./db";
import { forbidden, unauthorized } from "./http/errors";

export const SESSION_USER_SELECT = { id: true, name: true, username: true, role: true } as const;

export async function getSessionUser(req: NextRequest): Promise<SessionUser | null> {
  const userId = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  return db.user.findFirst({ where: { id: userId, ...notDeleted }, select: SESSION_USER_SELECT });
}

export async function requireUser(req: NextRequest, roles?: UserRole[]): Promise<SessionUser> {
  const user = await getSessionUser(req);
  if (!user) throw unauthorized();
  if (roles && !roles.includes(user.role)) throw forbidden();
  return user;
}

export async function setSessionCookie(res: NextResponse, userId: string) {
  res.cookies.set(SESSION_COOKIE, await signSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.delete(SESSION_COOKIE);
}
