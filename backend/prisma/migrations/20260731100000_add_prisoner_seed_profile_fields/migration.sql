-- AlterTable
ALTER TABLE "PrisonerProfile"
ADD COLUMN "publicId" TEXT,
ADD COLUMN "dateOfBirth" DATE,
ADD COLUMN "nationality" TEXT,
ADD COLUMN "profileImagePublicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PrisonerProfile_publicId_key"
ON "PrisonerProfile"("publicId");
