/*
  Warnings:

  - A unique constraint covering the columns `[userId,crmPropertyId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "crmCodeNo" TEXT,
ADD COLUMN     "crmImageUrl" TEXT,
ADD COLUMN     "crmImages" JSONB,
ADD COLUMN     "crmLocation" TEXT,
ADD COLUMN     "crmPrice" TEXT,
ADD COLUMN     "crmPropertyId" TEXT,
ADD COLUMN     "crmSlug" TEXT,
ADD COLUMN     "crmTitle" TEXT,
ADD COLUMN     "crmTransactionType" TEXT,
ADD COLUMN     "crmType" TEXT,
ALTER COLUMN "propertyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "areaLabel" TEXT,
ADD COLUMN     "priceLabel" TEXT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "areaSqFt" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_crmPropertyId_key" ON "CartItem"("userId", "crmPropertyId");
