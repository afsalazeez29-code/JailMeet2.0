-- CreateEnum
CREATE TYPE "VisitPassStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AppointmentChangeRequestType" AS ENUM ('CANCEL', 'RESCHEDULE');

-- CreateEnum
CREATE TYPE "AppointmentChangeRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SupportCategory" AS ENUM ('APPOINTMENT', 'PROFILE', 'VISIT_PASS', 'TECHNICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "SupportRequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterTable
ALTER TABLE "Notification"
ADD COLUMN "type" TEXT NOT NULL DEFAULT 'GENERAL',
ADD COLUMN "link" TEXT;

-- CreateTable
CREATE TABLE "VisitPass" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "passCode" TEXT NOT NULL,
    "status" "VisitPassStatus" NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VisitPass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentChangeRequest" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "requestType" "AppointmentChangeRequestType" NOT NULL,
    "requestedDate" TIMESTAMP(3),
    "reason" TEXT NOT NULL,
    "status" "AppointmentChangeRequestStatus" NOT NULL DEFAULT 'PENDING',
    "pendingKey" TEXT,
    "officerReply" TEXT,
    "reviewedByOfficerId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AppointmentChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JailRule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "JailRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportRequest" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "category" "SupportCategory" NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "SupportRequestStatus" NOT NULL DEFAULT 'OPEN',
    "adminReply" TEXT,
    "repliedByAdminId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SupportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitPass_appointmentId_key" ON "VisitPass"("appointmentId");
CREATE UNIQUE INDEX "VisitPass_passCode_key" ON "VisitPass"("passCode");
CREATE INDEX "VisitPass_status_expiresAt_idx" ON "VisitPass"("status", "expiresAt");
CREATE UNIQUE INDEX "AppointmentChangeRequest_pendingKey_key" ON "AppointmentChangeRequest"("pendingKey");
CREATE INDEX "AppointmentChangeRequest_visitorId_createdAt_idx" ON "AppointmentChangeRequest"("visitorId", "createdAt");
CREATE INDEX "AppointmentChangeRequest_status_createdAt_idx" ON "AppointmentChangeRequest"("status", "createdAt");
CREATE INDEX "JailRule_isActive_category_sortOrder_idx" ON "JailRule"("isActive", "category", "sortOrder");
CREATE INDEX "SupportRequest_visitorId_createdAt_idx" ON "SupportRequest"("visitorId", "createdAt");
CREATE INDEX "SupportRequest_status_category_createdAt_idx" ON "SupportRequest"("status", "category", "createdAt");
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "VisitPass" ADD CONSTRAINT "VisitPass_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AppointmentChangeRequest" ADD CONSTRAINT "AppointmentChangeRequest_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AppointmentChangeRequest" ADD CONSTRAINT "AppointmentChangeRequest_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "VisitorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AppointmentChangeRequest" ADD CONSTRAINT "AppointmentChangeRequest_reviewedByOfficerId_fkey" FOREIGN KEY ("reviewedByOfficerId") REFERENCES "OfficerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SupportRequest" ADD CONSTRAINT "SupportRequest_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "VisitorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupportRequest" ADD CONSTRAINT "SupportRequest_repliedByAdminId_fkey" FOREIGN KEY ("repliedByAdminId") REFERENCES "AdminProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
