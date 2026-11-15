import "server-only";
import bcrypt from "bcryptjs";
import { MESSAGE } from "@/constants/messages";
import type { LoginInput } from "@/schemas/auth.schema";
import type { UserCreateData, UserUpdateData } from "@/schemas/user.schema";
import { auditCreate, auditDelete, auditUpdate, notDeleted } from "../audit";
import { SESSION_USER_SELECT } from "../auth";
import { db } from "../db";
import { AppError, badRequest, notFound } from "../http/errors";

const BCRYPT_ROUNDS = 10;
const USER_SELECT = { ...SESSION_USER_SELECT, createdAt: true, updatedAt: true } as const;

export const hashPassword = (password: string) => bcrypt.hash(password, BCRYPT_ROUNDS);

export async function login({ username, password }: LoginInput) {
  const user = await db.user.findFirst({ where: { username: username.toLowerCase(), ...notDeleted } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError(401, MESSAGE.invalidLogin);
  return { id: user.id, name: user.name, username: user.username, role: user.role };
}

export function listUsers() {
  return db.user.findMany({ where: notDeleted, select: USER_SELECT, orderBy: { name: "asc" } });
}

async function getUser(id: string) {
  const user = await db.user.findFirst({ where: { id, ...notDeleted }, select: USER_SELECT });
  if (!user) throw notFound("User");
  return user;
}

export async function createUser({ password, ...data }: UserCreateData, userId: string) {
  return db.user.create({
    data: { ...data, passwordHash: await hashPassword(password), ...auditCreate(userId) },
    select: USER_SELECT,
  });
}

export async function updateUser(id: string, { password, ...data }: UserUpdateData, userId: string) {
  await getUser(id);
  return db.user.update({
    where: { id },
    data: { ...data, ...(password && { passwordHash: await hashPassword(password) }), ...auditUpdate(userId) },
    select: USER_SELECT,
  });
}

export async function deleteUser(id: string, userId: string) {
  if (id === userId) throw badRequest("Tidak bisa menghapus akun sendiri");
  await getUser(id);
  await db.user.update({ where: { id }, data: auditDelete(userId) });
}
