import "server-only";
import { LOW_STOCK_LIMIT, LOW_STOCK_THRESHOLD } from "@/constants/app";
import type { DashboardSummary } from "@/types/report";
import { toStatusCounts } from "@/utils/order";
import { notDeleted } from "../audit";
import { db } from "../db";
import { expireStaleDrafts } from "./order.service";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  await expireStaleDrafts();
  const lowStockWhere = { ...notDeleted, stock: { lte: LOW_STOCK_THRESHOLD } };

  const [statusGroups, lowStockParts, lowStockTotal] = await Promise.all([
    db.order.groupBy({ by: ["status"], where: notDeleted, _count: { _all: true } }),
    db.sparePart.findMany({
      where: lowStockWhere,
      select: { id: true, name: true, stock: true },
      orderBy: [{ stock: "asc" }, { name: "asc" }],
      take: LOW_STOCK_LIMIT,
    }),
    db.sparePart.count({ where: lowStockWhere }),
  ]);

  return { orderStatusCounts: toStatusCounts(statusGroups), lowStockParts, lowStockTotal };
}
