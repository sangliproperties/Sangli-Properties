-- AlterEnum
ALTER TYPE "PropertyType" ADD VALUE 'LAND';

-- AlterEnum
ALTER TYPE "Purpose" ADD VALUE 'SELL';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "amenities" TEXT,
ADD COLUMN     "buildingName" TEXT,
ADD COLUMN     "flatNo" TEXT,
ADD COLUMN     "furnishing" TEXT,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "plotAreaSqFt" INTEGER,
ADD COLUMN     "propertyAge" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_propertyId_key" ON "CartItem"("userId", "propertyId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
