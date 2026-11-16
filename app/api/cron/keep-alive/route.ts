import { publicRoute } from "@/server/http/handler";
import { unauthorized } from "@/server/http/errors";
import { pingDatabase } from "@/server/services/health.service";

/**
 * Dipanggil Vercel Cron (lihat vercel.json) setiap hari.
 * Vercel mengirim `Authorization: Bearer <CRON_SECRET>` bila env CRON_SECRET diset.
 */
export const GET = publicRoute(async ({ req }) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) throw unauthorized();
  return pingDatabase();
});
