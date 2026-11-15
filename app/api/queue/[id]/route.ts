import { publicRoute } from "@/server/http/handler";
import { getQueueOrder } from "@/server/services/queue.service";

type P = { id: string };

/** Publik: detail pengerjaan order hari ini (tanpa data harga). */
export const GET = publicRoute<P>(async ({ params }) => getQueueOrder(params.id));
