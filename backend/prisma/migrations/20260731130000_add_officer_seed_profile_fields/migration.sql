-- AlterTable
ALTER TABLE "OfficerProfile"
ADD COLUMN "publicId" TEXT,
ADD COLUMN "designation" TEXT,
ADD COLUMN "department" TEXT,
ADD COLUMN "joiningDate" DATE,
ADD COLUMN "shift" TEXT,
ADD COLUMN "officeLocation" TEXT,
ADD COLUMN "profilePic" TEXT,
ADD COLUMN "profileImagePublicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OfficerProfile_publicId_key"
ON "OfficerProfile"("publicId");
