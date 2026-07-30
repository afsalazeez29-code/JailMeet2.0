-- Stage 1 only: add the public ID without invalidating existing VisitorProfile rows.
-- Run the Node backfill and verify it before creating the NOT NULL finalization migration.
ALTER TABLE "VisitorProfile" ADD COLUMN "publicId" TEXT;

CREATE UNIQUE INDEX "VisitorProfile_publicId_key"
ON "VisitorProfile"("publicId");
