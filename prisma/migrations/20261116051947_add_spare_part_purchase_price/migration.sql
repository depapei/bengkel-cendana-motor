-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "totalCost" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "service_fees" ADD COLUMN     "sparepartCost" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "spare_parts" ADD COLUMN     "purchasePrice" INTEGER;

-- Backfill data lama: harga beli sparepart belum diketahui.
-- Item yang memakai sparepart → modal NULL (akan terisi saat harga beli sparepart diisi).
UPDATE "service_fees" SET "sparepartCost" = NULL WHERE "sparepartId" IS NOT NULL;

-- Order yang punya item sparepart aktif → modal total belum bisa dihitung.
UPDATE "orders" o SET "totalCost" = NULL
WHERE EXISTS (
  SELECT 1 FROM "service_fees" sf
  WHERE sf."orderId" = o."id" AND sf."sparepartId" IS NOT NULL AND sf."deletedAt" IS NULL
);
