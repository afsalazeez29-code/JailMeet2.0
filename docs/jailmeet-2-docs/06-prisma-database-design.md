# Prisma Database Design for JailMeet 2.0

This document outlines the modern database schema designed for JailMeet 2.0 using PostgreSQL and Prisma ORM.

## 1. Schema Improvements over Legacy MySQL
The new Prisma schema introduces several critical improvements:
*   **Centralized Authentication:** Instead of four different tables for authentication (`admin`, `officer`, `visitors`, `prisoner`), the new system utilizes a single central `User` table. This standardizes login flows, password hashing, and token generation across the application.
*   **Role-Based Access Control (RBAC):** Roles are explicitly enforced via an Enum (`ADMIN`, `OFFICER`, `VISITOR`, `PRISONER`) on the `User` model.
*   **Polymorphic-like Profiles:** User details are split into role-specific tables (`AdminProfile`, `OfficerProfile`, etc.). This enforces strict data typing while avoiding a monolithic `User` table filled with NULLs.
*   **Data Normalization:** Legacy flat fields on the prisoner table (like FIR details, medical details, and parole fields) have been normalized into distinct tables (`FirRecord`, `MedicalRecord`, `ParoleRequest`). This allows prisoners to have multiple FIRs, medical checkups, or parole requests over time.
*   **Security:** Predictable auto-increment integer IDs have been replaced with `UUID`s to prevent IDOR (Insecure Direct Object Reference) attacks and enumeration.
*   **Auditability & Communication:** New `AuditLog` and `Notification` models provide system tracking and better user feedback loops.

## 2. Legacy to Prisma Migration Mapping
| Legacy MySQL Table | New Prisma Models | Notes |
| :--- | :--- | :--- |
| `admin` | `User` (role=ADMIN) + `AdminProfile` | Credentials moved to `User` |
| `officer` | `User` (role=OFFICER) + `OfficerProfile` | Credentials moved to `User` |
| `visitors` | `User` (role=VISITOR) + `VisitorProfile` | Credentials moved to `User` |
| `prisoner` | `User` (role=PRISONER) + `PrisonerProfile` + `FirRecord` + `MedicalRecord` + `ParoleRequest` | Extracted nested data into their own tables |
| `appointments` | `Appointment` | Tied to `VisitorProfile` and `PrisonerProfile` |

## 3. Workflow Verification Check
The schema successfully supports all core JailMeet workflows:
1.  **Admin login and dashboard:** Handled by `User` (ADMIN) and `AdminProfile`.
2.  **Officer login and prisoner management:** Handled by `User` (OFFICER) and `OfficerProfile`. Officers can create/manage `PrisonerProfile` records.
3.  **Visitor registration and appointment booking:** Handled by `User` (VISITOR), `VisitorProfile`, and `Appointment`.
4.  **Prisoner login and parole request:** Handled by `User` (PRISONER), `PrisonerProfile`, and `ParoleRequest`.
5.  **Officer appointment approval/rejection:** `OfficerProfile` reviews `Appointment` (via `AppointmentStatus` enum and capturing the `officerId` of the reviewer).
6.  **Officer parole approval/rejection:** `OfficerProfile` reviews `ParoleRequest` (via `ParoleStatus` enum and capturing the `officerId` of the reviewer).
7.  **FIR records:** Tracked in a dedicated `FirRecord` model related to `PrisonerProfile`.
8.  **Medical records:** Tracked in a dedicated `MedicalRecord` model related to `PrisonerProfile`.
9.  **Status tracking:** Managed through `AppointmentStatus` and `ParoleStatus` enums.
10. **Notifications and audit logs:** Standardized via `Notification` and `AuditLog` models for system events.

---

## 4. Complete Draft `schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// =======================
// ENUMS
// =======================

enum Role {
  ADMIN
  OFFICER
  VISITOR
  PRISONER
}

enum AppointmentStatus {
  PENDING
  ACCEPTED
  REJECTED
  COMPLETED
  CANCELLED
}

enum ParoleStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum ActionType {
  CREATE
  UPDATE
  DELETE
  LOGIN
  APPROVE
  REJECT
}

// =======================
// CORE AUTH MODEL
// =======================

model User {
  id        String   @id @default(uuid())
  email     String?  @unique // Optional: Prisoners might not have email on creation
  password  String
  role      Role
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Profile Relations (One-to-One)
  adminProfile    AdminProfile?
  officerProfile  OfficerProfile?
  visitorProfile  VisitorProfile?
  prisonerProfile PrisonerProfile?

  // Utility Relations
  notifications   Notification[]
  auditLogs       AuditLog[]
}

// =======================
// ROLE PROFILES
// =======================

model AdminProfile {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name      String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OfficerProfile {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name      String
  phone     String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Workflows assigned/reviewed by this officer
  reviewedAppointments Appointment[]     @relation("OfficerReviewedAppointments")
  reviewedParoleReqs   ParoleRequest[]   @relation("OfficerReviewedParoles")
  createdPrisoners     PrisonerProfile[] @relation("OfficerCreatedPrisoners")
}

model VisitorProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name        String
  phone       String
  state       String?
  address     String?
  zip         String?
  profilePic  String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // A visitor can request many appointments
  appointments Appointment[]
}

model PrisonerProfile {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name           String
  age            Int
  gender         String
  caseDetails    String?
  admissionDate  DateTime
  sentencePeriod String?
  jailType       String?
  jailName       String?
  cellNumber     String?
  profilePic     String?
  
  // Track which officer added them to the system
  createdByOfficerId String?
  createdByOfficer   OfficerProfile? @relation("OfficerCreatedPrisoners", fields: [createdByOfficerId], references: [id], onDelete: SetNull)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Prisoner entities
  appointments   Appointment[]
  paroleRequests ParoleRequest[]
  firRecords     FirRecord[]
  medicalRecords MedicalRecord[]
}

// =======================
// WORKFLOW MODELS
// =======================

model Appointment {
  id            String            @id @default(uuid())
  visitorId     String
  visitor       VisitorProfile    @relation(fields: [visitorId], references: [id], onDelete: Cascade)
  prisonerId    String
  prisoner      PrisonerProfile   @relation(fields: [prisonerId], references: [id], onDelete: Cascade)
  
  // Officer who reviewed this request
  officerId     String?
  officer       OfficerProfile?   @relation("OfficerReviewedAppointments", fields: [officerId], references: [id], onDelete: SetNull)
  
  relationship  String
  message       String?
  requestedDate DateTime
  status        AppointmentStatus @default(PENDING)
  replyMessage  String?
  
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
}

model ParoleRequest {
  id            String          @id @default(uuid())
  prisonerId    String
  prisoner      PrisonerProfile @relation(fields: [prisonerId], references: [id], onDelete: Cascade)
  
  // Officer who reviewed this parole
  officerId     String?
  officer       OfficerProfile? @relation("OfficerReviewedParoles", fields: [officerId], references: [id], onDelete: SetNull)
  
  relativeName  String
  relationship  String
  purpose       String
  message       String?
  fromDate      DateTime
  toDate        DateTime
  status        ParoleStatus    @default(PENDING)
  officerReply  String?
  
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model FirRecord {
  id            String          @id @default(uuid())
  prisonerId    String
  prisoner      PrisonerProfile @relation(fields: [prisonerId], references: [id], onDelete: Cascade)
  
  firNumber     String
  description   String?
  dateFiled     DateTime
  
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model MedicalRecord {
  id             String          @id @default(uuid())
  prisonerId     String
  prisoner       PrisonerProfile @relation(fields: [prisonerId], references: [id], onDelete: Cascade)
  
  bloodGroup     String?
  allergies      String?
  checkupDetails String?
  
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

// =======================
// UTILITY MODELS
// =======================

model Notification {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title         String
  message       String
  isRead        Boolean  @default(false)
  
  createdAt     DateTime @default(now())
}

model AuditLog {
  id            String     @id @default(uuid())
  userId        String?
  user          User?      @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  action        ActionType
  entity        String
  entityId      String?
  details       String?
  
  createdAt     DateTime   @default(now())
}
```
