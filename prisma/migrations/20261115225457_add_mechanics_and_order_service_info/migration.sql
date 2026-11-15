-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "mechanicId" TEXT,
ADD COLUMN     "mechanicNote" TEXT,
ADD COLUMN     "mileage" INTEGER,
ADD COLUMN     "nextServiceDate" DATE,
ADD COLUMN     "nextServiceNote" TEXT;

-- CreateTable
CREATE TABLE "mechanics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" TEXT,

    CONSTRAINT "mechanics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mechanics_name_key" ON "mechanics"("name");

-- CreateIndex
CREATE INDEX "orders_mechanicId_idx" ON "orders"("mechanicId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_mechanicId_fkey" FOREIGN KEY ("mechanicId") REFERENCES "mechanics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
