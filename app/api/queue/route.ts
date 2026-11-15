import { listQuerySchema } from "@/schemas/list.schema";
import { parseQuery, publicRoute } from "@/server/http/handler";
import { listQueue } from "@/server/services/queue.service";

/** Publik: papan antrean customer (tanpa data harga). */
export const GET = publicRoute(async ({ req }) => listQueue(parseQuery(req, listQuerySchema)));
