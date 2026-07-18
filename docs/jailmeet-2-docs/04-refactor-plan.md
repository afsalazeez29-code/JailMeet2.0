# Refactor Plan & Modern Architecture

This document combines the features to migrate, security problems identified in the legacy PHP codebase, and the plan for the new JailMeet 2.0 modern architecture.

## 1. Feature List to Migrate

### Admin Features
- Admin authentication
- Dashboard with system-wide analytics
- Officer management (Create, Read, Update, Delete)
- Global read-only views for Prisoners, Visitors, and Appointments

### Officer Features
- Officer authentication
- Prisoner management (CRUD, FIR assignment, medical records)
- Appointment management (Review, Accept/Reject visits)
- Parole management (Review, Accept/Reject parole requests)

### Visitor Features
- Visitor registration and authentication
- Browse/Search prisoners
- Book visit appointments (Date, time, relation)
- View appointment status and officer replies
- Profile management (including avatar uploads)

### Prisoner Features
- Prisoner authentication
- Submit parole requests (Dates, relative info, purpose)
- View parole request status
- View history of visitor appointments

## 2. Security Problems to Fix
1. **Plaintext Passwords:** The legacy `jailmeet.sql` reveals that default passwords (e.g., `officer123`, `admin123`) were stored as plaintext or weakly hashed in some contexts. JailMeet 2.0 must use strong hashing (e.g., `bcrypt` or `argon2`) for all passwords.
2. **SQL Injection Vulnerabilities:** Standard PHP `mysql_*` or unparameterized `mysqli_*` queries were common in this era. JailMeet 2.0 will use Prisma ORM to prevent SQL injection.
3. **Session Management:** Legacy PHP session management is prone to hijacking and fixation. The new system will use secure HTTP-only JWTs (JSON Web Tokens).
4. **Broken Access Control (IDOR):** Legacy systems often pass IDs in the URL (e.g., `?id=5`) without checking if the logged-in user owns or has rights to that resource. The new RBAC system will validate permissions on every request.
5. **Data Validation:** Lack of strict input validation on forms. The new Express backend will use a validation library (e.g., `zod` or `class-validator`).
6. **Cross-Site Scripting (XSS):** User inputs (like parole messages or FIRs) might be rendered directly in HTML. React/Next.js automatically escapes output by default.
7. **Unrestricted File Uploads:** Visitor profile pictures might allow PHP script uploads. The new system must validate MIME types and store files securely (e.g., in a cloud bucket or restricted local folder).

## 3. New Modern Architecture Plan

### Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, React Query (for data fetching)
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (replacing MySQL)
- **ORM:** Prisma (for type-safe database access and migrations)
- **Authentication:** JWT-based authentication stored in HTTP-only cookies
- **Role-Based Access Control (RBAC):** Middleware in Express to enforce Admin, Officer, Visitor, and Prisoner boundaries.

### Database Design Improvements (PostgreSQL + Prisma)
- Normalize the `appointments` table (remove redundant `name`, `email`, `phno` fields since they exist in the `visitors` table).
- Use `UUID`s or cuid for primary keys instead of predictable auto-incrementing integers to prevent enumeration attacks.
- Separate `ParoleRequests` into its own table rather than flat fields on the `Prisoner` table, allowing a prisoner to have multiple parole requests over time.
- Use explicit foreign keys constraints (e.g., `PrisonerId`, `VisitorId`) with cascading rules.

### Implementation Phases
1. **Phase 1: Project Initialization:** Set up the monorepo (or separate frontend/backend repos). Initialize Express + Prisma + PostgreSQL backend. Initialize Next.js frontend.
2. **Phase 2: Database Modeling:** Translate `jailmeet.sql` into a `schema.prisma` file, applying normalization and UUID improvements.
3. **Phase 3: Auth & RBAC:** Implement JWT login/registration endpoints and RBAC middleware. Create Next.js auth context.
4. **Phase 4: API Development:** Build RESTful routes for Prisoners, Officers, Visitors, Appointments, and Paroles.
5. **Phase 5: Frontend Development:** Recreate the Admin, Officer, Visitor, and Prisoner dashboards in Next.js using modern UI libraries.
6. **Phase 6: File Uploads:** Implement secure avatar and document uploads using `multer` (backend) and a storage service.
