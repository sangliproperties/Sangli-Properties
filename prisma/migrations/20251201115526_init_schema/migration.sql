-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'PLOT', 'INDUSTRIAL');

-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('BUY', 'RENT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('NEW', 'RESALE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SOLD', 'RENTED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ONGOING', 'COMPLETED', 'UPCOMING');

-- CreateEnum
CREATE TYPE "EnquiryType" AS ENUM ('GENERAL', 'PROPERTY', 'PROJECT');

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "purpose" "Purpose" NOT NULL,
    "price" INTEGER NOT NULL,
    "areaSqFt" INTEGER NOT NULL,
    "bhk" INTEGER,
    "city" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "address" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "transaction" "TransactionType" NOT NULL,
    "possession" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "projectId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "reraNumber" TEXT,
    "developerName" TEXT,
    "minPrice" INTEGER,
    "maxPrice" INTEGER,
    "minAreaSqFt" INTEGER,
    "maxAreaSqFt" INTEGER,
    "minBhk" INTEGER,
    "maxBhk" INTEGER,
    "city" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "address" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ONGOING',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT,
    "type" "EnquiryType" NOT NULL,
    "propertyId" INTEGER,
    "projectId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
