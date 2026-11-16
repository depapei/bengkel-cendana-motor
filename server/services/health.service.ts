import "server-only";
import { db } from "../db";

/** Query ringan ke DB, supaya project Supabase (free tier) tidak di-pause karena tidak aktif. */
export async function pingDatabase() {
  await db.$queryRaw`SELECT 1`;
  return { ok: true, at: new Date() };
}
