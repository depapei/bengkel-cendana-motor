import "server-only";
import type { MechanicData, MechanicUpdateData } from "@/schemas/mechanic.schema";
import { auditCreate, auditUpdate, notDeleted } from "../audit";
import { db, type Tx } from "../db";
import { notFound } from "../http/errors";

export function listMechanics() {
  return db.mechanic.findMany({ where: notDeleted, orderBy: { name: "asc" } });
}

export function createMechanic(data: MechanicData, userId: string) {
  return db.mechanic.create({ data: { ...data, ...auditCreate(userId) } });
}

export async function updateMechanic(id: string, data: MechanicUpdateData, userId: string) {
  const mechanic = await db.mechanic.findFirst({ where: { id, ...notDeleted }, select: { id: true } });
  if (!mechanic) throw notFound("Mekanik");
  return db.mechanic.update({ where: { id }, data: { ...data, ...auditUpdate(userId) } });
}

/** Pastikan mekanik yang ditugaskan ada & belum dihapus. */
export async function assertMechanic(tx: Tx, id: string | null) {
  if (!id) return;
  const mechanic = await tx.mechanic.findFirst({ where: { id, ...notDeleted }, select: { id: true } });
  if (!mechanic) throw notFound("Mekanik");
}
