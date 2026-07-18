# JailMeet 2.0 - Modern System Blueprint

## Target Stack
*   **Frontend:** Next.js + TypeScript + Tailwind CSS
*   **Backend:** Express.js + TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Auth:** JWT + bcrypt
*   **Authorization:** Role-Based Access Control (RBAC)
*   **Roles:** ADMIN, OFFICER, VISITOR, PRISONER

---

## 1. Final Project Goal
To modernize the legacy PHP/MySQL JailMeet application into a secure, scalable, and maintainable full-stack TypeScript platform. The new architecture will resolve existing security vulnerabilities (plaintext passwords, SQL injection), introduce strict Role-Based Access Control (RBAC), and provide a modern, responsive user experience for all system actors (Administrators, Officers, Visitors, and Prisoners).

## 2. New Folder Structure
A monorepo approach or separate repositories can be used. Below is the monorepo structure representation:
```text
jailmeet-v2/
├── backend/                  # Express.js + TypeScript
│   ├── prisma/               # Prisma schema and migrations
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── middlewares/      # Auth, RBAC, Validation
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helpers (JWT, bcrypt)
│   │   └── index.ts          # Entry point
│   └── package.json
└── frontend/                 # Next.js + TypeScript
    ├── src/
    │   ├── app/              # Next.js App Router (Pages & Layouts)
    │   ├── components/       # Reusable UI components
    │   ├── hooks/            # Custom React hooks (React Query)
    │   ├── lib/              # API clients, utilities
    │   └── types/            # TypeScript interfaces
    └── package.json
```

## 3. New Database Entities
*   **User:** A unified table for all authentication, distinguished by a `role` enum.
*   **Profile:** Extended details for a user (can be polymorphic or specific fields in User based on role).
*   **PrisonerRecord:** Specific details for inmates (case, admission date, sentence, medical info).
*   **Appointment (Visit):** Records of requested visits by visitors.
*   **ParoleRequest:** Records of parole applications by prisoners.

## 4. Relationship Between Entities
*   **User (Visitor) -> Appointment:** One-to-Many (A visitor can request multiple appointments).
*   **User (Prisoner) -> Appointment:** One-to-Many (A prisoner can have multiple appointments).
*   **User (Prisoner) -> ParoleRequest:** One-to-Many (A prisoner can request parole multiple times).
*   **User (Prisoner) -> PrisonerRecord:** One-to-One (Detailed jail records linked to the prisoner user).
*   **User (Officer) -> Appointment:** One-to-Many (An officer reviews multiple appointments).
*   **User (Officer) -> ParoleRequest:** One-to-Many (An officer reviews multiple parole requests).

## 5. New API Modules
1.  **Auth Module:** Handles login, registration, password hashing, and JWT generation.
2.  **User Module:** Manages CRUD operations for Admins, Officers, and Visitors.
3.  **Prisoner Module:** Manages CRUD operations for PrisonerRecords and associated Users.
4.  **Appointment Module:** Handles booking, updating status (accept/reject), and fetching visit history.
5.  **Parole Module:** Handles creating parole requests, reviewing them, and fetching status.

## 6. New API Route Map
*   `/api/auth/login` (POST)
*   `/api/auth/register` (POST) - Visitors only
*   `/api/users` (GET, POST, PUT, DELETE) - Admin only
*   `/api/prisoners` (GET, POST, PUT, DELETE) - Officer/Admin
*   `/api/appointments` (GET, POST, PUT) - Visitor (create), Officer (review), Prisoner (view)
*   `/api/paroles` (GET, POST, PUT) - Prisoner (create), Officer (review)

## 7. New Frontend Route Map
*   `/` (Landing Page)
*   `/login`
*   `/register`
*   `/admin/dashboard`
*   `/admin/officers`
*   `/officer/dashboard`
*   `/officer/prisoners`
*   `/officer/appointments`
*   `/officer/paroles`
*   `/visitor/dashboard`
*   `/visitor/book-visit`
*   `/visitor/appointments`
*   `/prisoner/dashboard`
*   `/prisoner/parole-request`
*   `/prisoner/history`

## 8. Authentication Flow
1.  User submits credentials to `/api/auth/login`.
2.  Backend verifies password using bcrypt.
3.  Backend generates a JWT payload containing `userId` and `role`.
4.  JWT is sent to the frontend via an HTTP-only cookie to prevent XSS.
5.  Frontend stores minimal state (isAuthenticated, role) in Context/Zustand for UI rendering.

## 9. Role-Based Access Plan
*   **ADMIN:** Full access to all API routes (`/api/*`). Can manage other admins and officers.
*   **OFFICER:** Access to manage prisoners (`/api/prisoners`), review appointments, and review parole requests.
*   **VISITOR:** Can only read their own data, book appointments, and view public prisoner lists.
*   **PRISONER:** Can only view their own history and submit parole requests.
*   *Implementation:* Express middleware `authorizeRoles(['ADMIN', 'OFFICER'])` applied to protected routes.

## 10. Migration Mapping from Old PHP Files to New Modules
| Legacy PHP File | New System Module/Route |
| :--- | :--- |
| `adminlogin.php`, `officerlogin.php`, `login.php`, `prisonerlogin.php` | unified `/api/auth/login` |
| `register.php` | `/api/auth/register` |
| `admin/adindex.php`, `admin/officersdetails.php` | `frontend/src/app/admin/dashboard`, API: `/api/users` |
| `officer/prisoners.php`, `officer/add_prisoner.php` | `frontend/src/app/officer/prisoners`, API: `/api/prisoners` |
| `visitor/visitorpage/html/booking.php` | `frontend/src/app/visitor/book-visit`, API: `/api/appointments` |
| `officer/parole.php`, `prisoner/parole.php` | `frontend/src/app/officer/paroles`, API: `/api/paroles` |

## 11. First Backend Milestone
*   Initialize Express + TypeScript project.
*   Set up Prisma with PostgreSQL.
*   Define the unified `User` model in `schema.prisma`.
*   Implement `/api/auth/login` and `/api/auth/register` endpoints.
*   Implement JWT generation and RBAC middleware.

## 12. First Frontend Milestone
*   Initialize Next.js + Tailwind CSS project.
*   Create standard layouts for the different roles.
*   Implement the `/login` and `/register` pages.
*   Integrate frontend auth context with the backend login API (handling HTTP-only cookies).
*   Create basic protected routes that redirect unauthorized users.

## 13. Development Order
1.  **Database & Auth Core (Backend):** Prisma schema, Auth routes, JWT middleware.
2.  **Auth UI (Frontend):** Login/Register screens, auth state management.
3.  **User Management (Full-stack):** Admin dashboards to create Officers/Prisoners.
4.  **Core Domain Logic (Backend):** Appointments and Parole endpoints.
5.  **Role Dashboards (Frontend):** Officer, Visitor, and Prisoner specific pages.
6.  **Refinement:** File uploads (avatars), final UI polish, and comprehensive testing.
