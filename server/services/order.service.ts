import "server-only";
import dayjs from "dayjs";
import { Prisma } from "@/generated/prisma/client";
import { APP_TIMEZONE } from "@/constants/app";
import {
  DRAFT_EXPIRY_DAYS,
  DRAFT_EXPIRY_REASON,
  ITEM_EDITABLE_STATUSES,
  ORDER_NO_PREFIX,
  ORDER_STATUS_META,
  ORDER_STATUS_TIMESTAMP_FIELD,
  ORDER_STATUS_TRANSITIONS,
  OrderStatus,
  STOCK_COMMITTED_STATUSES,
} from "@/constants/order-status";
import { PaymentStatus } from "@/constants/payment";
import { STOCK_NOTE } from "@/constants/stock-movement";
import type { OrderListQuery } from "@/schemas/list.schema";
import type {
  OrderCreateData,
  OrderData,
  OrderStatusChangeData,
  PaymentData,
  ServiceFeeData,
} from "@/schemas/order.schema";
import { normalizePhone, normalizePlat } from "@/utils/normalize";
import { calcSubtotal, sumQtyBySparePart } from "@/utils/order";
import { auditCreate, auditDelete, auditUpdate, notDeleted } from "../audit";
import { db, type Tx } from "../db";
import { badRequest, notFound } from "../http/errors";
import { toPaginated, toSkipTake } from "../pagination";
import { getVehicle } from "./customer.service";
import { assertMechanic } from "./mechanic.service";
import { applyStockDelta, returnStock, takeStock } from "./stock.service";

const ENTITY = "Order";
const ORDER_NO_RETRY = 3;

const ORDER_INCLUDE = {
  customer: { select: { id: true, name: true, phoneNumber: true } },
  customerVehicle: { select: { id: true, platNomor: true, brand: true } },
  mechanic: { select: { id: true, name: true } },
} satisfies Prisma.OrderInclude;

const ORDER_DETAIL_INCLUDE = {
  ...ORDER_INCLUDE,
  serviceFees: {
    where: notDeleted,
    include: { sparePart: { select: { id: true, name: true, stock: true } } },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.OrderInclude;

type OrderRow = Prisma.OrderGetPayload<object>;

const isStockCommitted = (status: OrderStatus) => STOCK_COMMITTED_STATUSES.includes(status);

// ---------------------------------------------------------------- query

/** Draft yang terlalu lama otomatis dibatalkan (Spesifikasi §3). */
export async function expireStaleDrafts() {
  await db.order.updateMany({
    where: {
      ...notDeleted,
      status: OrderStatus.draft,
      draftAt: { lt: dayjs().subtract(DRAFT_EXPIRY_DAYS, "day").toDate() },
    },
    data: { status: OrderStatus.cancelled, cancelledAt: new Date(), cancelReason: DRAFT_EXPIRY_REASON },
  });
}

function listWhere({ q, status, customerId, customerVehicleId }: OrderListQuery): Prisma.OrderWhereInput {
  const phone = q ? normalizePhone(q) : "";
  return {
    ...notDeleted,
    status,
    customerId,
    customerVehicleId,
    ...(q && {
      OR: [
        { orderNo: { contains: q, mode: "insensitive" } },
        { customer: { name: { contains: q, mode: "insensitive" } } },
        ...(phone ? [{ customer: { phoneNumber: { contains: phone } } }] : []),
        { customerVehicle: { platNomor: { contains: normalizePlat(q) } } },
      ],
    }),
  };
}

export async function listOrders(query: OrderListQuery) {
  await expireStaleDrafts();
  const where = listWhere(query);
  const [items, total] = await db.$transaction([
    db.order.findMany({ where, include: ORDER_INCLUDE, orderBy: { createdAt: "desc" }, ...toSkipTake(query) }),
    db.order.count({ where }),
  ]);
  return toPaginated(query, items, total);
}

export async function getOrder(id: string) {
  await expireStaleDrafts();
  const order = await db.order.findFirst({ where: { id, ...notDeleted }, include: ORDER_DETAIL_INCLUDE });
  if (!order) throw notFound(ENTITY);
  return order;
}

// ---------------------------------------------------------------- order

/** Input form → kolom Prisma (tanggal `YYYY-MM-DD` → Date untuk kolom @db.Date). */
function toOrderColumns({ nextServiceDate, ...data }: OrderData) {
  return { ...data, nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : null };
}

async function nextOrderNo(tx: Tx) {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE }).format(new Date()).replaceAll("-", "");
  const prefix = `${ORDER_NO_PREFIX}-${date}-`;
  const last = await tx.order.findFirst({
    where: { orderNo: { startsWith: prefix } },
    orderBy: { orderNo: "desc" },
    select: { orderNo: true },
  });
  const sequence = last ? Number(last.orderNo.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(sequence).padStart(3, "0")}`;
}

export async function createOrder({ customerVehicleId, ...data }: OrderCreateData, userId: string) {
  const vehicle = await getVehicle(customerVehicleId);
  await assertMechanic(db, data.mechanicId);
  for (let attempt = 1; ; attempt++) {
    try {
      const order = await db.$transaction(async (tx) =>
        tx.order.create({
          data: {
            ...toOrderColumns(data),
            orderNo: await nextOrderNo(tx),
            customerId: vehicle.customerId,
            customerVehicleId,
            ...auditCreate(userId),
          },
        }),
      );
      return getOrder(order.id);
    } catch (error) {
      const isOrderNoClash = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
      if (!isOrderNoClash || attempt >= ORDER_NO_RETRY) throw error;
    }
  }
}

export async function updateOrder(id: string, data: OrderData, userId: string) {
  await db.$transaction(async (tx) => {
    const order = await lockOrder(tx, id);
    assertEditable(order);
    await assertMechanic(tx, data.mechanicId);
    await tx.order.update({ where: { id }, data: { ...toOrderColumns(data), ...auditUpdate(userId) } });
  });
  return getOrder(id);
}

/** Kunci baris order agar perubahan status & item tidak balapan. */
async function lockOrder(tx: Tx, id: string): Promise<OrderRow> {
  await tx.$queryRaw`SELECT id FROM "orders" WHERE id = ${id} FOR UPDATE`;
  const order = await tx.order.findFirst({ where: { id, ...notDeleted } });
  if (!order) throw notFound(ENTITY);
  return order;
}

function assertEditable(order: OrderRow) {
  if (!ITEM_EDITABLE_STATUSES.includes(order.status)) {
    throw badRequest(`Order berstatus ${ORDER_STATUS_META[order.status].label} tidak bisa diubah`);
  }
}

async function recalcTotal(tx: Tx, orderId: string, userId: string) {
  const { _sum } = await tx.serviceFee.aggregate({ where: { orderId, ...notDeleted }, _sum: { subtotal: true } });
  await tx.order.update({ where: { id: orderId }, data: { totalPrice: _sum.subtotal ?? 0, ...auditUpdate(userId) } });
}

// ---------------------------------------------------------------- items (ServiceFee)

async function sparePartPrice(tx: Tx, sparepartId: string | null) {
  if (!sparepartId) return 0;
  const part = await tx.sparePart.findFirst({ where: { id: sparepartId, ...notDeleted }, select: { price: true } });
  if (!part) throw notFound("Sparepart");
  return part.price;
}

async function findItem(tx: Tx, orderId: string, itemId: string) {
  const item = await tx.serviceFee.findFirst({ where: { id: itemId, orderId, ...notDeleted } });
  if (!item) throw notFound("Item order");
  return item;
}

/** Jalankan perubahan item dalam transaksi + kunci order + hitung ulang total. */
async function mutateItems(
  orderId: string,
  userId: string,
  mutate: (tx: Tx, order: OrderRow, stockCommitted: boolean) => Promise<void>,
) {
  await db.$transaction(async (tx) => {
    const order = await lockOrder(tx, orderId);
    assertEditable(order);
    await mutate(tx, order, isStockCommitted(order.status));
    await recalcTotal(tx, orderId, userId);
  });
  return getOrder(orderId);
}

export function addItem(orderId: string, data: ServiceFeeData, userId: string) {
  return mutateItems(orderId, userId, async (tx, order, stockCommitted) => {
    const price = await sparePartPrice(tx, data.sparepartId);
    await tx.serviceFee.create({
      data: {
        ...data,
        orderId,
        sparepartPrice: price,
        subtotal: calcSubtotal(data.qty, price, data.laborPrice),
        ...auditCreate(userId),
      },
    });
    if (stockCommitted && data.sparepartId) {
      await takeStock(tx, { sparepartId: data.sparepartId, qty: data.qty, orderId, userId, note: STOCK_NOTE.itemAdded(order.orderNo) });
    }
  });
}

export function updateItem(orderId: string, itemId: string, data: ServiceFeeData, userId: string) {
  return mutateItems(orderId, userId, async (tx, order, stockCommitted) => {
    const item = await findItem(tx, orderId, itemId);
    const samePart = item.sparepartId === data.sparepartId;
    // Harga snapshot dipertahankan selama sparepart tidak diganti (Spesifikasi §5).
    const price = samePart ? item.sparepartPrice : await sparePartPrice(tx, data.sparepartId);

    if (stockCommitted) {
      const stock = { orderId, userId, note: STOCK_NOTE.itemChanged(order.orderNo) };
      if (samePart && item.sparepartId) {
        await applyStockDelta(tx, { ...stock, sparepartId: item.sparepartId, qty: data.qty - item.qty });
      } else {
        if (item.sparepartId) await returnStock(tx, { ...stock, sparepartId: item.sparepartId, qty: item.qty });
        if (data.sparepartId) await takeStock(tx, { ...stock, sparepartId: data.sparepartId, qty: data.qty });
      }
    }

    await tx.serviceFee.update({
      where: { id: itemId },
      data: {
        ...data,
        sparepartPrice: price,
        subtotal: calcSubtotal(data.qty, price, data.laborPrice),
        ...auditUpdate(userId),
      },
    });
  });
}

export function deleteItem(orderId: string, itemId: string, userId: string) {
  return mutateItems(orderId, userId, async (tx, order, stockCommitted) => {
    const item = await findItem(tx, orderId, itemId);
    await tx.serviceFee.update({ where: { id: itemId }, data: auditDelete(userId) });
    if (stockCommitted && item.sparepartId) {
      await returnStock(tx, { sparepartId: item.sparepartId, qty: item.qty, orderId, userId, note: STOCK_NOTE.itemRemoved(order.orderNo) });
    }
  });
}

// ---------------------------------------------------------------- status & payment

export async function changeStatus(id: string, { status, cancelReason, returns = [] }: OrderStatusChangeData, userId: string) {
  await db.$transaction(async (tx) => {
    const order = await lockOrder(tx, id);
    if (!ORDER_STATUS_TRANSITIONS[order.status].includes(status)) {
      throw badRequest(
        `Status tidak bisa diubah dari ${ORDER_STATUS_META[order.status].label} ke ${ORDER_STATUS_META[status].label}`,
      );
    }

    const items = await tx.serviceFee.findMany({ where: { orderId: id, ...notDeleted } });
    const stock = { orderId: id, userId };

    if (status === OrderStatus.booked) {
      if (items.length === 0) throw badRequest("Order minimal harus punya 1 item sebelum booked");
      for (const [sparepartId, qty] of sumQtyBySparePart(items)) {
        await takeStock(tx, { ...stock, sparepartId, qty, note: STOCK_NOTE.booked(order.orderNo) });
      }
    }

    if (status === OrderStatus.cancelled && order.status === OrderStatus.booked) {
      for (const [sparepartId, qty] of sumQtyBySparePart(items)) {
        await returnStock(tx, { ...stock, sparepartId, qty, note: STOCK_NOTE.cancelled(order.orderNo) });
      }
    }

    if (status === OrderStatus.cancelled && order.status === OrderStatus.in_progress) {
      // Hanya sparepart yang belum terpakai yang dikembalikan (input manual).
      for (const { serviceFeeId, qty } of returns) {
        const item = items.find((candidate) => candidate.id === serviceFeeId);
        if (!item?.sparepartId) throw badRequest("Item pengembalian stok tidak valid");
        if (qty > item.qty) throw badRequest(`Qty kembali untuk ${item.name} melebihi qty item (${item.qty})`);
        await returnStock(tx, { ...stock, sparepartId: item.sparepartId, qty, note: STOCK_NOTE.cancelled(order.orderNo) });
      }
    }

    await tx.order.update({
      where: { id },
      data: {
        status,
        [ORDER_STATUS_TIMESTAMP_FIELD[status]]: new Date(),
        ...(status === OrderStatus.cancelled && { cancelReason }),
        ...auditUpdate(userId),
      },
    });
  });
  return getOrder(id);
}

export async function recordPayment(id: string, { paymentMethod }: PaymentData, userId: string) {
  await db.$transaction(async (tx) => {
    const order = await lockOrder(tx, id);
    if (order.status !== OrderStatus.done) throw badRequest("Pembayaran hanya bisa dicatat untuk order yang sudah selesai");
    if (order.paymentStatus === PaymentStatus.paid) throw badRequest("Order sudah lunas");
    await tx.order.update({
      where: { id },
      data: { paymentStatus: PaymentStatus.paid, paymentMethod, paidAt: new Date(), ...auditUpdate(userId) },
    });
  });
  return getOrder(id);
}
