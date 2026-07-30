-- CreateTable
CREATE TABLE "LandingAsset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "cloudName" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL DEFAULT 'image',
    "deliveryType" TEXT NOT NULL DEFAULT 'upload',
    "format" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingAsset_key_key" ON "LandingAsset"("key");

-- CreateIndex
CREATE UNIQUE INDEX "LandingAsset_publicId_key" ON "LandingAsset"("publicId");

-- CreateIndex
CREATE INDEX "LandingAsset_isActive_sortOrder_idx" ON "LandingAsset"("isActive", "sortOrder");
