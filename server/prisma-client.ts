import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { requireEnv } from "./env";

/** Dipakai oleh server (server/db.ts) dan seed script. */
export function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: requireEnv("DATABASE_URL") });
  return new PrismaClient({ adapter });
}
