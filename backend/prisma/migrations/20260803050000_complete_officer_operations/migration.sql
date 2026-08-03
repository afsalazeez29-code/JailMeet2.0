-- Additive Officer operations migration. Existing provenance and workflow data are preserved.

-- ExtendEnum
ALTER TYPE "ActionType" ADD VALUE 'VIEW';
ALTER TYPE "ActionType" ADD VALUE 'ARCHIVE';
ALTER TYPE "ActionType" ADD VALUE 'VERIFY';
ALTER TYPE "ActionType" ADD VALUE 'ASSIGN';
ALTER TYPE "ActionType" ADD VALUE 'COMPLETE';
ALTER TYPE "ActionType" ADD VALUE 'CONFLICT';
ALTER TYPE "ActionType" ADD VALUE 'ESCALATE';

-- CreateEnum
CREATE TYPE "MedicalAccessLevel" AS ENUM ('NONE', 'SUMMARY', 'MANAGE');
CREATE TYPE "FirStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'CLOSED', 'ARCHIVED');
CREATE TYPE "MedicalTreatmentStatus" AS ENUM ('OBSERVATION', 'ACTIVE_TREATMENT', 'FOLLOW_UP_REQUIRED', 'COMPLETED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "OfficerProfile"
ADD COLUMN "medicalAccessLevel" "MedicalAccessLevel" NOT NULL DEFAULT 'SUMMARY';

ALTER TABLE "PrisonerProfile"
ADD COLUMN "assignedOfficerId" TEXT;

-- Preserve creation provenance while establishing the initial operational assignment.
UPDATE "PrisonerProfile"
SET "assignedOfficerId" = "createdByOfficerId"
WHERE "createdByOfficerId" IS NOT NULL;

ALTER TABLE "Appointment"
ADD COLUMN "reference" TEXT,
ADD COLUMN "pendingKey" TEXT,
ADD COLUMN "reviewedAt" TIMESTAMP(3);

UPDATE "Appointment"
SET "reference" = 'APT-' || UPPER(md5("id"));

ALTER TABLE "Appointment"
ALTER COLUMN "reference" SET NOT NULL;

UPDATE "Appointment"
SET "pendingKey" = "visitorId" || ':' || "prisonerId" || ':' ||
  to_char("requestedDate" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
WHERE "status" = 'PENDING';

ALTER TABLE "ParoleRequest"
ADD COLUMN "reference" TEXT,
ADD COLUMN "pendingKey" TEXT,
ADD COLUMN "reviewedAt" TIMESTAMP(3);

UPDATE "ParoleRequest"
SET "reference" = 'PAR-' || UPPER(md5("id"));

ALTER TABLE "ParoleRequest"
ALTER COLUMN "reference" SET NOT NULL;

UPDATE "ParoleRequest"
SET "pendingKey" = "prisonerId"
WHERE "status" = 'PENDING';

ALTER TABLE "VisitPass"
ADD COLUMN "checkedInByOfficerId" TEXT;

ALTER TABLE "AppointmentChangeRequest"
ADD COLUMN "reference" TEXT;

UPDATE "AppointmentChangeRequest"
SET "reference" = 'CHG-' || UPPER(md5("id"));

ALTER TABLE "AppointmentChangeRequest"
ALTER COLUMN "reference" SET NOT NULL;

ALTER TABLE "Notification"
ADD COLUMN "dedupeKey" TEXT;

ALTER TABLE "PrisonerSupportRequest"
ADD COLUMN "escalatedToOfficerId" TEXT,
ADD COLUMN "escalatedAt" TIMESTAMP(3),
ADD COLUMN "officerResponse" TEXT,
ADD COLUMN "officerHandledAt" TIMESTAMP(3);

ALTER TABLE "FirRecord"
ADD COLUMN "reference" TEXT,
ADD COLUMN "status" "FirStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN "createdByOfficerId" TEXT,
ADD COLUMN "updatedByOfficerId" TEXT,
ADD COLUMN "lastChangeReason" TEXT,
ADD COLUMN "archivedAt" TIMESTAMP(3),
ADD COLUMN "archiveReason" TEXT;

UPDATE "FirRecord"
SET "reference" = 'FIR-' || UPPER(md5("id"));

ALTER TABLE "FirRecord"
ALTER COLUMN "reference" SET NOT NULL;

ALTER TABLE "MedicalRecord"
ADD COLUMN "reference" TEXT,
ADD COLUMN "checkupDate" TIMESTAMP(3),
ADD COLUMN "medicalProfessional" TEXT,
ADD COLUMN "diagnosis" TEXT,
ADD COLUMN "medication" TEXT,
ADD COLUMN "treatmentStatus" "MedicalTreatmentStatus" NOT NULL DEFAULT 'OBSERVATION',
ADD COLUMN "followUpDate" TIMESTAMP(3),
ADD COLUMN "operationalInstructions" TEXT,
ADD COLUMN "restrictedNotes" TEXT,
ADD COLUMN "createdByOfficerId" TEXT,
ADD COLUMN "updatedByOfficerId" TEXT,
ADD COLUMN "archivedAt" TIMESTAMP(3),
ADD COLUMN "archiveReason" TEXT;

UPDATE "MedicalRecord"
SET "reference" = 'MED-' || UPPER(md5("id"));

ALTER TABLE "MedicalRecord"
ALTER COLUMN "reference" SET NOT NULL;

ALTER TABLE "AuditLog"
ADD COLUMN "entityReference" TEXT,
ADD COLUMN "result" TEXT;

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "User"("role", "isActive");
CREATE INDEX "PrisonerProfile_assignedOfficerId_idx" ON "PrisonerProfile"("assignedOfficerId");
CREATE UNIQUE INDEX "Appointment_reference_key" ON "Appointment"("reference");
CREATE UNIQUE INDEX "Appointment_pendingKey_key" ON "Appointment"("pendingKey");
CREATE INDEX "Appointment_status_requestedDate_idx" ON "Appointment"("status", "requestedDate");
CREATE INDEX "Appointment_prisonerId_status_requestedDate_idx" ON "Appointment"("prisonerId", "status", "requestedDate");
CREATE INDEX "Appointment_visitorId_requestedDate_idx" ON "Appointment"("visitorId", "requestedDate");
CREATE INDEX "VisitPass_checkedInByOfficerId_checkedInAt_idx" ON "VisitPass"("checkedInByOfficerId", "checkedInAt");
CREATE UNIQUE INDEX "AppointmentChangeRequest_reference_key" ON "AppointmentChangeRequest"("reference");
CREATE INDEX "AppointmentChangeRequest_appointmentId_status_idx" ON "AppointmentChangeRequest"("appointmentId", "status");
CREATE UNIQUE INDEX "ParoleRequest_reference_key" ON "ParoleRequest"("reference");
CREATE UNIQUE INDEX "ParoleRequest_pendingKey_key" ON "ParoleRequest"("pendingKey");
CREATE INDEX "ParoleRequest_status_createdAt_idx" ON "ParoleRequest"("status", "createdAt");
CREATE INDEX "ParoleRequest_prisonerId_status_fromDate_idx" ON "ParoleRequest"("prisonerId", "status", "fromDate");
CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");
CREATE INDEX "PrisonerSupportRequest_escalatedToOfficerId_officerHandledAt_idx" ON "PrisonerSupportRequest"("escalatedToOfficerId", "officerHandledAt");
CREATE UNIQUE INDEX "FirRecord_reference_key" ON "FirRecord"("reference");
CREATE INDEX "FirRecord_prisonerId_status_dateFiled_idx" ON "FirRecord"("prisonerId", "status", "dateFiled");
CREATE UNIQUE INDEX "MedicalRecord_reference_key" ON "MedicalRecord"("reference");
CREATE INDEX "MedicalRecord_prisonerId_treatmentStatus_checkupDate_idx" ON "MedicalRecord"("prisonerId", "treatmentStatus", "checkupDate");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
CREATE INDEX "AuditLog_entity_createdAt_idx" ON "AuditLog"("entity", "createdAt");

-- AddForeignKey
ALTER TABLE "PrisonerProfile" ADD CONSTRAINT "PrisonerProfile_assignedOfficerId_fkey" FOREIGN KEY ("assignedOfficerId") REFERENCES "OfficerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VisitPass" ADD CONSTRAINT "VisitPass_checkedInByOfficerId_fkey" FOREIGN KEY ("checkedInByOfficerId") REFERENCES "OfficerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PrisonerSupportRequest" ADD CONSTRAINT "PrisonerSupportRequest_escalatedToOfficerId_fkey" FOREIGN KEY ("escalatedToOfficerId") REFERENCES "OfficerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FirRecord" ADD CONSTRAINT "FirRecord_createdByOfficerId_fkey" FOREIGN KEY ("createdByOfficerId") REFERENCES "OfficerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FirRecord" ADD CONSTRAINT "FirRecord_updatedByOfficerId_fkey" FOREIGN KEY ("updatedByOfficerId") REFERENCES "OfficerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_createdByOfficerId_fkey" FOREIGN KEY ("createdByOfficerId") REFERENCES "OfficerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_updatedByOfficerId_fkey" FOREIGN KEY ("updatedByOfficerId") REFERENCES "OfficerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
