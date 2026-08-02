-- CreateEnum
CREATE TYPE "PrisonerSupportCategory" AS ENUM (
  'PAROLE',
  'VISITATION',
  'CASE_SENTENCE',
  'PROFILE_CORRECTION',
  'MEDICAL_ASSISTANCE',
  'LEGAL_ASSISTANCE',
  'TECHNICAL',
  'OTHER'
);

-- CreateEnum
CREATE TYPE "JailRuleAudience" AS ENUM ('VISITOR', 'PRISONER', 'ALL');

-- AlterTable
ALTER TABLE "JailRule"
ADD COLUMN "audience" "JailRuleAudience" NOT NULL DEFAULT 'VISITOR';

-- CreateIndex
CREATE INDEX "JailRule_isActive_audience_category_sortOrder_idx"
ON "JailRule"("isActive", "audience", "category", "sortOrder");

-- CreateTable
CREATE TABLE "PrisonerSupportRequest" (
  "id" TEXT NOT NULL,
  "prisonerProfileId" TEXT NOT NULL,
  "category" "PrisonerSupportCategory" NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" "SupportRequestStatus" NOT NULL DEFAULT 'OPEN',
  "adminReply" TEXT,
  "repliedByAdminId" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PrisonerSupportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrisonerSupportRequest_prisonerProfileId_idx"
ON "PrisonerSupportRequest"("prisonerProfileId");
CREATE INDEX "PrisonerSupportRequest_status_idx"
ON "PrisonerSupportRequest"("status");
CREATE INDEX "PrisonerSupportRequest_category_idx"
ON "PrisonerSupportRequest"("category");
CREATE INDEX "PrisonerSupportRequest_createdAt_idx"
ON "PrisonerSupportRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "PrisonerSupportRequest"
ADD CONSTRAINT "PrisonerSupportRequest_prisonerProfileId_fkey"
FOREIGN KEY ("prisonerProfileId") REFERENCES "PrisonerProfile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PrisonerSupportRequest"
ADD CONSTRAINT "PrisonerSupportRequest_repliedByAdminId_fkey"
FOREIGN KEY ("repliedByAdminId") REFERENCES "AdminProfile"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
