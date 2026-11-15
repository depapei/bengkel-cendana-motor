import "server-only";
import type { BrandData } from "@/schemas/brand.schema";
import { auditCreate, auditDelete, auditUpdate, notDeleted } from "../audit";
import { db } from "../db";
import { notFound } from "../http/errors";

export function listBrands() {
  return db.brandVehicle.findMany({ where: notDeleted, orderBy: [{ name: "asc" }, { type: "asc" }] });
}

async function getBrand(id: string) {
  const brand = await db.brandVehicle.findFirst({ where: { id, ...notDeleted } });
  if (!brand) throw notFound("Merek/tipe motor");
  return brand;
}

export function createBrand(data: BrandData, userId: string) {
  return db.brandVehicle.create({ data: { ...data, ...auditCreate(userId) } });
}

export async function updateBrand(id: string, data: BrandData, userId: string) {
  await getBrand(id);
  return db.brandVehicle.update({ where: { id }, data: { ...data, ...auditUpdate(userId) } });
}

export async function deleteBrand(id: string, userId: string) {
  await getBrand(id);
  await db.brandVehicle.update({ where: { id }, data: auditDelete(userId) });
}
