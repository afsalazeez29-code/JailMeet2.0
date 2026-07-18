# User Role Flows

This document outlines the flows and permissions for each user role in the JailMeet system.

## 1. Admin
**Role:** Superuser with full visibility across the system.
**Flows:**
- **Login:** Authenticates via `/admin/adminlogin.php`.
- **Dashboard:** Views overall system statistics and links to management pages (`adindex.php`).
- **Manage Officers:** Can view and add new officers (`add_officer.php`, `officersdetails.php`).
- **System View:** Has read access to all entities, including all prisoners (`prisonerdetails.php`), visitors (`userdetails.php`), and appointments (`appointments.php`).
- **Profile:** Can update their own profile and add/manage other admins.

## 2. Officer
**Role:** Jail administrator responsible for managing prisoners, paroles, and visitor appointments.
**Flows:**
- **Login:** Authenticates via `/officer/officerlogin.php`.
- **Manage Prisoners:** Full CRUD operations on prisoners (`prisoners.php`, `add_prisoner.php`, etc.). They input FIR details and medical info.
- **Manage Appointments:** Reviews visit requests from visitors. Can accept or reject them (`requests.php`, `newappointment.php`).
- **Manage Parole:** Reviews parole requests submitted by prisoners. Can accept or reject them (`parole.php`, `accept_parole.php`, `reject_parole.php`).
- **Profile:** Can manage their own profile details.

## 3. Visitor
**Role:** Civilian looking to visit a prisoner.
**Flows:**
- **Registration/Login:** Must register for an account (`register.php`) and log in (`login.php`).
- **View Prisoners:** Can browse the list of prisoners (`prisoners.php`).
- **Book Appointment:** Selects a prisoner and submits a visit request with date, relationship, and message (`booking.php`).
- **Check Status:** Can check if their appointment request was accepted, pending, or rejected (`status.php`).
- **Profile:** Can manage their account and profile picture.

## 4. Prisoner
**Role:** Inmate who can view their visits and request parole.
**Flows:**
- **Login:** Authenticates via `/prisoner/prisonerlogin.php` (Accounts are likely created by officers, not self-registered).
- **Parole Request:** Can submit a request for parole by providing dates, purpose, and relative details (`parole.php`).
- **Parole Status:** Can check the status of their parole requests (`parolestatus.php`).
- **Visitor History:** Can view the list of visitors who have booked appointments with them (`visitorhistory.php`).
