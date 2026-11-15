import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { CustomerCreateData, CustomerData, VehicleData } from "@/schemas/customer.schema";
import type { ListQuery } from "@/schemas/list.schema";
import { normalizePhone, normalizePlat } from "@/utils/normalize";
import { auditCreate, auditDelete, auditUpdate, notDeleted } from "../audit";
import { db } from "../db";
import { notFound } from "../http/errors";
import { toPaginated, toSkipTake } from "../pagination";

const CUSTOMER_INCLUDE = {
  vehicles: { where: notDeleted, include: { brand: true }, orderBy: { createdAt: "asc" } },
} satisfies Prisma.CustomerInclude;

/** Cari berdasarkan nama, nomor HP, atau plat nomor (Spesifikasi §2.1). */
function searchWhere(q?: string): Prisma.CustomerWhereInput {
  if (!q) return notDeleted;
  const phone = normalizePhone(q);
  return {
    ...notDeleted,
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      ...(phone ? [{ phoneNumber: { contains: phone } }] : []),
      { vehicles: { some: { ...notDeleted, platNomor: { contains: normalizePlat(q) } } } },
    ],
  };
}

export async function listCustomers(query: ListQuery) {
  const where = searchWhere(query.q);
  const [items, total] = await db.$transaction([
    db.customer.findMany({ where, include: CUSTOMER_INCLUDE, orderBy: { name: "asc" }, ...toSkipTake(query) }),
    db.customer.count({ where }),
  ]);
  return toPaginated(query, items, total);
}

export async function getCustomer(id: string) {
  const customer = await db.customer.findFirst({ where: { id, ...notDeleted }, include: CUSTOMER_INCLUDE });
  if (!customer) throw notFound("Customer");
  return customer;
}

export async function createCustomer({ vehicle, ...data }: CustomerCreateData, userId: string) {
  return db.customer.create({
    data: {
      ...data,
      ...auditCreate(userId),
      ...(vehicle && { vehicles: { create: { ...vehicle, ...auditCreate(userId) } } }),
    },
    include: CUSTOMER_INCLUDE,
  });
}

export async function updateCustomer(id: string, data: CustomerData, userId: string) {
  await getCustomer(id);
  return db.customer.update({ where: { id }, data: { ...data, ...auditUpdate(userId) }, include: CUSTOMER_INCLUDE });
}

export async function deleteCustomer(id: string, userId: string) {
  await getCustomer(id);
  await db.$transaction([
    db.customerVehicle.updateMany({ where: { customerId: id, ...notDeleted }, data: auditDelete(userId) }),
    db.customer.update({ where: { id }, data: auditDelete(userId) }),
  ]);
}

export async function getVehicle(id: string) {
  const vehicle = await db.customerVehicle.findFirst({ where: { id, ...notDeleted } });
  if (!vehicle) throw notFound("Kendaraan");
  return vehicle;
}

export async function addVehicle(customerId: string, data: VehicleData, userId: string) {
  await getCustomer(customerId);
  return db.customerVehicle.create({ data: { ...data, customerId, ...auditCreate(userId) }, include: { brand: true } });
}

export async function updateVehicle(id: string, data: VehicleData, userId: string) {
  await getVehicle(id);
  return db.customerVehicle.update({ where: { id }, data: { ...data, ...auditUpdate(userId) }, include: { brand: true } });
}

export async function deleteVehicle(id: string, userId: string) {
  await getVehicle(id);
  await db.customerVehicle.update({ where: { id }, data: auditDelete(userId) });
}
