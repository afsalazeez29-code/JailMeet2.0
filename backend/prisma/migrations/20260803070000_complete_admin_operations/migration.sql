-- Add password-change metadata without altering existing credentials.
ALTER TABLE "User" ADD COLUMN "passwordChangedAt" TIMESTAMP(3);

-- Add safe public references. Existing rows receive deterministic references;
-- no workflow content or ownership is changed.
ALTER TABLE "SupportRequest" ADD COLUMN "reference" TEXT;
UPDATE "SupportRequest" SET "reference" = 'SUP-' || UPPER(MD5("id")) WHERE "reference" IS NULL;
ALTER TABLE "SupportRequest" ALTER COLUMN "reference" SET NOT NULL;
CREATE UNIQUE INDEX "SupportRequest_reference_key" ON "SupportRequest"("reference");

ALTER TABLE "PrisonerSupportRequest" ADD COLUMN "reference" TEXT;
UPDATE "PrisonerSupportRequest" SET "reference" = 'PSR-' || UPPER(MD5("id")) WHERE "reference" IS NULL;
ALTER TABLE "PrisonerSupportRequest" ALTER COLUMN "reference" SET NOT NULL;
CREATE UNIQUE INDEX "PrisonerSupportRequest_reference_key" ON "PrisonerSupportRequest"("reference");

ALTER TABLE "JailRule" ADD COLUMN "reference" TEXT;
UPDATE "JailRule" SET "reference" = 'RUL-' || UPPER(MD5("id")) WHERE "reference" IS NULL;
ALTER TABLE "JailRule" ALTER COLUMN "reference" SET NOT NULL;
CREATE UNIQUE INDEX "JailRule_reference_key" ON "JailRule"("reference");

-- Persist immediately published, role-targeted announcements and their
-- visibility window. This migration does not add a scheduler.
CREATE TABLE "Announcement" (
  "id" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "targetRole" "Role" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "link" TEXT,
  "activeFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Announcement_reference_key" ON "Announcement"("reference");
CREATE INDEX "Announcement_targetRole_activeFrom_expiresAt_idx" ON "Announcement"("targetRole", "activeFrom", "expiresAt");
CREATE INDEX "Announcement_createdAt_idx" ON "Announcement"("createdAt");
