-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'kasir');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('draft', 'booked', 'in-progress', 'done', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('unpaid', 'paid');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'transfer', 'qris');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('in', 'out', 'return', 'adjust');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_vehicles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "brand_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_vehicles" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "platNomor" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "customer_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spare_parts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "spare_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerVehicleId" TEXT NOT NULL,
    "complaint" TEXT NOT NULL,
    "notes" TEXT,
    "totalPrice" INTEGER NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL DEFAULT 'draft',
    "cancelReason" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'unpaid',
    "paymentMethod" "PaymentMethod",
    "draftAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookedAt" TIMESTAMPTZ,
    "progressAt" TIMESTAMPTZ,
    "doneAt" TIMESTAMPTZ,
    "cancelledAt" TIMESTAMPTZ,
    "paidAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_fees" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sparepartId" TEXT,
    "name" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "sparepartPrice" INTEGER NOT NULL DEFAULT 0,
    "laborPrice" INTEGER NOT NULL DEFAULT 0,
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "service_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "sparepartId" TEXT NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "qty" INTEGER NOT NULL,
    "orderId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phoneNumber_key" ON "customers"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "brand_vehicles_name_type_key" ON "brand_vehicles"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "customer_vehicles_platNomor_key" ON "customer_vehicles"("platNomor");

-- CreateIndex
CREATE INDEX "customer_vehicles_customerId_idx" ON "customer_vehicles"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNo_key" ON "orders"("orderNo");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_customerVehicleId_idx" ON "orders"("customerVehicleId");

-- CreateIndex
CREATE INDEX "service_fees_orderId_idx" ON "service_fees"("orderId");

-- CreateIndex
CREATE INDEX "stock_movements_sparepartId_idx" ON "stock_movements"("sparepartId");

-- AddForeignKey
ALTER TABLE "customer_vehicles" ADD CONSTRAINT "customer_vehicles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_vehicles" ADD CONSTRAINT "customer_vehicles_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand_vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerVehicleId_fkey" FOREIGN KEY ("customerVehicleId") REFERENCES "customer_vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_fees" ADD CONSTRAINT "service_fees_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_fees" ADD CONSTRAINT "service_fees_sparepartId_fkey" FOREIGN KEY ("sparepartId") REFERENCES "spare_parts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_sparepartId_fkey" FOREIGN KEY ("sparepartId") REFERENCES "spare_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Stok sparepart tidak boleh negatif (Spesifikasi §4)
ALTER TABLE "spare_parts" ADD CONSTRAINT "spare_parts_stock_non_negative" CHECK ("stock" >= 0);
