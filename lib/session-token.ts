import { jwtVerify, SignJWT } from "jose";
import { SESSION_MAX_AGE_SECONDS } from "@/constants/app";

/** Token sesi (JWT) — dipakai oleh proxy.ts dan route handler. */
function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Environment variable AUTH_SECRET belum diisi (lihat .env.example)");
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
