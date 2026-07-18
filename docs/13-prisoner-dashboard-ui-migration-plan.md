# Prisoner Dashboard UI Migration Plan

## Short Summary

- The old prisoner dashboard source is confirmed at `frontend/prisoner/index.php`.
- The UI template is a Dashtreme-style Bootstrap admin dashboard, different from Admin, Visitor, and Officer.
- The old dashboard is mostly a prisoner profile/detail table, not a pure stats dashboard.
- `public/legacy/prisoner` already exists and currently contains no `.php`, `.env`, `.sql`, or `db.php` files.
- The source `frontend/prisoner` folder contains old PHP files, including `db.php` with old local MySQL/XAMPP-style credentials.
- The backend prisoner dashboard API returns summary fields only, so many old profile-table fields have no current dashboard API equivalent.
- Phase 1.6 should still audit/clean public for template junk, but no unsafe public PHP/env/sql files were found in this phase.
- Phase 1.5 should target missing or differently located visual assets before Phase 2 conversion.

## 1. Old Layout Files Used

Main source:

- `frontend/prisoner/index.php`

Files directly included by `index.php`:

- `frontend/prisoner/header.php`
- `frontend/prisoner/navbar.php`
- `frontend/prisoner/sidebar.php`
- `frontend/prisoner/db.php`

Related prisoner legacy files in the same role folder:

- `frontend/prisoner/parole.php`
- `frontend/prisoner/parolestatus.php`
- `frontend/prisoner/visitorhistory.php`
- `frontend/prisoner/prisonerlogin.php`

Related include folder files found but not included by `index.php`:

- `frontend/prisoner/includes/header.php`
- `frontend/prisoner/includes/footer.php`

Important finding:

- `index.php` assembles the old page by including `header.php`, `navbar.php`, `sidebar.php`, and `db.php`.
- `header.php` owns the document opening, `<head>`, favicon, and CSS links.
- `navbar.php` starts the wrapper/content structure and renders the topbar.
- `sidebar.php` renders the left sidebar.
- `index.php` renders the prisoner profile/dashboard content and closes the wrapper/body/html.

## 2. Old CSS/JS Assets Required

Template/framework identification:

- The prisoner dashboard uses a Dashtreme/Bootstrap admin template style.
- Evidence: `bg-theme bg-theme1`, `#wrapper`, `#sidebar-wrapper`, `topbar-nav`, `zmdi` icons, `simplebar`, `sidebar-menu.css`, and `app-style.css`.

CSS referenced from `frontend/prisoner/header.php`:

- `frontend/prisoner/assets/images/favicon.ico`
- `frontend/prisoner/assets/plugins/vectormap/jquery-jvectormap-2.0.2.css`
- `frontend/prisoner/assets/plugins/simplebar/css/simplebar.css`
- `frontend/prisoner/assets/css/bootstrap.min.css`
- `frontend/prisoner/assets/css/animate.css`
- `frontend/prisoner/assets/css/icons.css`
- `frontend/prisoner/assets/css/sidebar-menu.css`
- `frontend/prisoner/assets/css/app-style.css`

JS referenced from `frontend/prisoner/index.php`:

- `frontend/prisoner/assets/js/jquery.min.js`
- `frontend/prisoner/assets/js/popper.min.js`
- `frontend/prisoner/assets/js/bootstrap.min.js`
- `frontend/prisoner/assets/plugins/simplebar/js/simplebar.js`
- `frontend/prisoner/assets/js/sidebar-menu.js`
- `frontend/prisoner/assets/js/jquery.loading-indicator.js`
- `frontend/prisoner/assets/js/app-script.js`
- External Font Awesome kit: `https://kit.fontawesome.com/a076d05399.js`

Current public availability under `frontend/public/legacy/prisoner`:

- `/legacy/prisoner/assets/images/favicon.ico` exists.
- `/legacy/prisoner/assets/plugins/simplebar/css/simplebar.css` exists.
- `/legacy/prisoner/assets/css/bootstrap.min.css` exists.
- `/legacy/prisoner/assets/css/animate.css` exists.
- `/legacy/prisoner/assets/css/icons.css` exists.
- `/legacy/prisoner/assets/css/sidebar-menu.css` exists.
- `/legacy/prisoner/assets/css/app-style.css` exists.
- `/legacy/prisoner/assets/js/jquery.min.js` exists.
- `/legacy/prisoner/assets/js/popper.min.js` exists.
- `/legacy/prisoner/assets/js/bootstrap.min.js` exists.
- `/legacy/prisoner/assets/plugins/simplebar/js/simplebar.js` exists.
- `/legacy/prisoner/assets/js/sidebar-menu.js` exists.
- `/legacy/prisoner/assets/js/app-script.js` exists.

Missing or not present in either source/public asset tree:

- `frontend/prisoner/assets/plugins/vectormap/jquery-jvectormap-2.0.2.css`
- `frontend/prisoner/assets/js/jquery.loading-indicator.js`

Recommendation:

- Phase 2 should load only the CSS needed for layout in `app/prisoner/layout.tsx`.
- Do not load old jQuery/bootstrap/sidebar JS globally unless a behavior cannot reasonably be recreated with React.
- Menu toggling and profile dropdown behavior should be React state.

## 3. Images/Icons Required

Images directly referenced:

- `frontend/prisoner/assets/images/favicon.ico`
- `frontend/logo.png`, referenced from `sidebar.php` as `../logo.png`
- `frontend/images.png`, used as fallback prisoner image in `index.php` and `navbar.php`
- `frontend/officer/uploads/<dynamic file>`, used when an old prisoner `dp` profile image exists

Current public paths confirmed:

- `/legacy/prisoner/assets/images/favicon.ico` exists.
- `/legacy/logos/logo.png` exists.
- `/legacy/landing/images.png` exists.
- `/legacy/visitor/visitorpage/html/images.png` exists.

Missing from role-specific prisoner public path:

- `/legacy/prisoner/logo.png` does not exist.
- `/legacy/prisoner/images.png` does not exist.

Potential public path recommendation:

- Use `/legacy/logos/logo.png` for the sidebar JailMeet logo, or copy `frontend/logo.png` to `/legacy/prisoner/logo.png` if role-local paths are preferred.
- Use `/legacy/landing/images.png` as the fallback prisoner image, or copy `frontend/images.png` to `/legacy/prisoner/images.png` if role-local paths are preferred.
- Do not expose arbitrary old `officer/uploads` files until uploads/media handling is designed.

Icon dependencies:

- `zmdi` icons from Material Design Iconic Font are provided by `assets/css/icons.css` and font files under `assets/fonts`.
- Simple Line Icons are used by navbar classes such as `icon-menu`, `icon-magnifier`, `icon-wallet`, and `icon-power`.
- Font Awesome icons are used in popover buttons (`fas fa-eye`, `fas fa-user`, `fas fa-file-alt`) via an external kit in old code.

## 4. Sidebar/Navbar/Header/Footer Structure

Header:

- `header.php` outputs the document start, `<html>`, `<head>`, page title, favicon, and global CSS links.
- This should become CSS/link setup in `app/prisoner/layout.tsx`, not a component that emits `<html>` or `<head>`.

Navbar:

- `navbar.php` starts with `session_start()` and `include('db.php')`.
- It queries the old MySQL `prisoner` table by `$_SESSION['pris_id']`.
- It renders `<div id="wrapper">`, `.content-wrapper`, `.container-fluid`, and a fixed topbar header.
- Topbar contains:
  - Sidebar toggle link: `.toggle-menu`
  - Search form
  - Profile dropdown with prisoner image, prisoner ID, prisoner name, account link, logout link

Sidebar:

- `sidebar.php` renders `#sidebar-wrapper`.
- Brand section:
  - Logo image: `../logo.png`
  - Text: `JailMeet`
- Menu links:
  - Dashboard -> `index.php`
  - Request Parole -> `parole.php`
  - Visitors History -> `visitorhistory.php`
  - Parole Status -> `parolestatus.php`

Footer:

- No prisoner dashboard footer is directly included by `index.php`.
- `frontend/prisoner/includes/footer.php` exists, but it is not part of the old dashboard assembly.
- `PrisonerFooter` can be empty/minimal unless a real dashboard footer is later identified.

## 5. PHP Code To Remove

From `frontend/prisoner/index.php`:

- `include('header.php');`
- `include('navbar.php');`
- `include('sidebar.php');`
- `include('db.php');`
- `session_start();`
- `$_SESSION['pris_id']`
- Re-inclusion of `db.php` when `$conn` is missing.
- MySQL prisoner detail query:
  - `SELECT pris_id, pris_name, pris_age, pris_case, jailtype, jailname, pris_adm, pris_period, fir_number, fir, checkup, blood, allergies, dp, par_status, pris_cell, parole_to FROM prisoner WHERE pris_id = ?`
- MySQL appointment query:
  - `SELECT date, name FROM appointments WHERE prisid = ? AND UPPER(accept) = 'ACCEPTED' AND LOWER(visit_status) = 'pending' ORDER BY date DESC`
- Prepared statement operations:
  - `$conn->prepare(...)`
  - `$stmt->bind_param(...)`
  - `$stmt->execute()`
  - `$stmt->get_result()`
  - `$stmt->close()`
  - `$conn->close()`
- `die(...)` error handling.
- `file_exists(...)` check against old `../officer/uploads/`.
- All PHP `echo` blocks for profile fields, parole badge, FIR popover, visitation badge, and medical data.
- Old jQuery popover initialization script.

From `frontend/prisoner/navbar.php`:

- `session_start();`
- `include('db.php');`
- `$_SESSION['pris_id']`
- MySQL query for `pris_id`, `pris_name`, and `dp`.
- Dynamic `image_path`, prisoner ID, and prisoner name PHP output.
- Old logout link to `prisonerlogin.php`.

From `frontend/prisoner/db.php`:

- Old `new mysqli(...)` connection.
- Local MySQL connection variables.
- Connection error `die(...)`.

Credential note:

- `frontend/prisoner/db.php` contains old local MySQL/XAMPP-style connection values.
- It does not reference the new Neon PostgreSQL database.
- Values should not be printed, copied to public, or reused.

## 6. Dynamic Dashboard Data

Old identity/profile data from `prisoner` table:

- Prisoner ID: `pris_id`
- Full Name: `pris_name`
- Age: `pris_age`
- Crime: `pris_case`
- Jail Type: `jailtype`
- Jail Name: `jailname`
- Date of Incarceration: `pris_adm`
- Duration: `pris_period`
- FIR Number: `fir_number`
- FIR Details: `fir`
- Last Checkup: `checkup`
- Blood Type: `blood`
- Allergies: `allergies`
- Profile Image: `dp`
- Parole Status: `par_status`
- Cell Block: `pris_cell`
- Parole End Date: `parole_to`

Old visitation data from `appointments` table:

- Pending accepted visits for the prisoner:
  - Appointment `date`
  - Visitor `name`
- Displayed as:
  - `No Visitors`
  - `Pending Visit on <date> by <name>`
  - `View All Visitors` popover if more than one pending visitor

Old UI-only derived values:

- FIR not registered fallback.
- No FIR details available fallback.
- Not assigned cell fallback.
- Guest/not logged in fallback.
- Parole status badges for:
  - Not Requested
  - Pending
  - Accepted
  - Rejected
  - Returned
  - Unknown

## 7. Matching Backend API Fields

Source of truth inspected:

- `backend/src/modules/dashboard/dashboard.service.ts`

GET `/api/dashboard/prisoner` returns exactly:

- `myParoleRequests`
- `pendingParoleRequests`
- `approvedParoleRequests`
- `rejectedParoleRequests`
- `myAppointments`

Cross-reference against old dashboard data:

| Old dashboard data | Old source | New backend equivalent | Migration note |
| --- | --- | --- | --- |
| Prisoner ID | `prisoner.pris_id` / session | `GET /api/auth/me` gives user `id` | New auth user ID may not equal old `pris_id`. |
| Full Name | `prisoner.pris_name` | `GET /api/auth/me` gives user `name` | Can show logged-in user's name, but not old prisoner profile name fields unless a profile endpoint exists. |
| Age | `prisoner.pris_age` | No dashboard equivalent | Missing from current dashboard API. |
| Crime | `prisoner.pris_case` | No dashboard equivalent | Missing from current dashboard API. |
| Jail Type | `prisoner.jailtype` | No dashboard equivalent | Missing from current dashboard API. |
| Jail Name | `prisoner.jailname` | No dashboard equivalent | Missing from current dashboard API. |
| Date of Incarceration | `prisoner.pris_adm` | No dashboard equivalent | Missing from current dashboard API. |
| Duration | `prisoner.pris_period` | No dashboard equivalent | Missing from current dashboard API. |
| FIR Number/Details | `prisoner.fir_number`, `prisoner.fir` | No dashboard equivalent | Missing from current dashboard API. |
| Medical Records | `checkup`, `blood`, `allergies` | No dashboard equivalent | Missing from current dashboard API. |
| Parole Status badge | `prisoner.par_status` | Partially represented by parole counts | API gives counts, not latest status. |
| Cell Block | `prisoner.pris_cell` | No dashboard equivalent | Missing from current dashboard API. |
| Pending visitors list | `appointments` query | `myAppointments` count only | API gives count, not visitor names/dates. |
| My parole requests count | Not directly in old page | `myParoleRequests` | New stat available. |
| Pending parole requests count | Not directly in old page | `pendingParoleRequests` | New stat available. |
| Approved parole requests count | Not directly in old page | `approvedParoleRequests` | New stat available. |
| Rejected parole requests count | Not directly in old page | `rejectedParoleRequests` | New stat available. |
| My appointments count | Not directly in old page | `myAppointments` | New stat available. |

Important implementation warning:

- Use `approvedParoleRequests`, not `acceptedParoleRequests`.
- Most old profile details cannot be faithfully populated from the current dashboard API alone.
- Phase 3 should either show available auth identity plus summary cards, or require a future profile endpoint before recreating every old table row with real data.

## 8. Public Safety Audit

Unsafe/source files found under `frontend/prisoner`:

- `frontend/prisoner/db.php`
- `frontend/prisoner/header.php`
- `frontend/prisoner/index.php`
- `frontend/prisoner/navbar.php`
- `frontend/prisoner/sidebar.php`
- `frontend/prisoner/parole.php`
- `frontend/prisoner/parolestatus.php`
- `frontend/prisoner/prisonerlogin.php`
- `frontend/prisoner/visitorhistory.php`
- `frontend/prisoner/includes/header.php`
- `frontend/prisoner/includes/footer.php`

Credential-bearing file:

- `frontend/prisoner/db.php` contains old local MySQL/XAMPP-style database connection settings.
- Values were not printed.
- It appears old/local-only and unrelated to the new Neon database.

Already-copied public prisoner folder:

- `frontend/public/legacy/prisoner` exists.
- It contains `assets/` and `assets1/`.
- No `.php`, `.env`, `.sql`, `db.php`, or obvious credential-bearing config files were found under `frontend/public/legacy/prisoner`.

Public cleanup candidates:

- `frontend/public/legacy/prisoner/assets1/scss/Readme.txt`
- Any `.DS_Store` files if present in later cleanup scans.
- `assets1/` appears to be a copied landing/Dewi asset set, not required for the Dashtreme prisoner dashboard unless future pages reference it.

## 9. New Component Breakdown

Recommended components:

- `components/legacy/prisoner/PrisonerLayout.tsx`
  - Owns shared wrapper, body class, sidebar open state, and content wrapper.
- `components/legacy/prisoner/PrisonerNavbar.tsx`
  - Converts `navbar.php`.
  - Removes PHP/MySQL/session logic.
  - Uses React state for profile dropdown and mobile toggle.
- `components/legacy/prisoner/PrisonerSidebar.tsx`
  - Converts `sidebar.php`.
  - Keeps old sidebar classes and menu hierarchy.
  - Replaces `.php` links with Next.js routes.
- `components/legacy/prisoner/PrisonerFooter.tsx`
  - Empty/minimal unless a real dashboard footer is identified.
- `app/prisoner/dashboard/page.tsx`
  - Phase 2 placeholder.
  - Phase 3 data-driven dashboard content.
- Optional future:
  - `components/legacy/prisoner/PrisonerDashboardStats.tsx`
  - `components/legacy/prisoner/PrisonerProfileSummary.tsx`

## 10. New Route Structure

Immediate routes:

- `/prisoner`
  - Redirect to `/prisoner/dashboard`.
- `/prisoner/dashboard`
  - Migrated prisoner dashboard.

Future prisoner module route map:

- Old `frontend/prisoner/index.php` -> `/prisoner/dashboard`
- Old `frontend/prisoner/parole.php` -> `/prisoner/parole/request`
- Old `frontend/prisoner/parolestatus.php` -> `/prisoner/parole/status`
- Old `frontend/prisoner/visitorhistory.php` -> `/prisoner/visits/history`
- Old `frontend/prisoner/prisonerlogin.php` -> already replaced by shared `/login`

## 11. Risks And Missing Assets

Risks:

- The old page is profile/detail-heavy, but the current backend prisoner dashboard API is summary/count-heavy.
- Recreating the full old table with real data may require a future prisoner profile API.
- The old page uses jQuery and Bootstrap popovers. Phase 3 should reimplement popover-like behavior in React if needed, not load jQuery.
- The old source references missing template files:
  - `assets/plugins/vectormap/jquery-jvectormap-2.0.2.css`
  - `assets/js/jquery.loading-indicator.js`
- The old profile image logic depends on `../officer/uploads/`, which should not be exposed blindly in the frontend until upload/media strategy is defined.
- Public `assets1/` appears unrelated to the prisoner dashboard shell and may be leftover landing assets.
- `db.php` contains old local credentials and must never be copied into public.

Missing or path-decision assets:

- Missing public role-local logo path: `/legacy/prisoner/logo.png`
- Existing alternative: `/legacy/logos/logo.png`
- Missing public role-local fallback prisoner image path: `/legacy/prisoner/images.png`
- Existing alternative: `/legacy/landing/images.png`
- Missing source/public path: `/legacy/prisoner/assets/plugins/vectormap/jquery-jvectormap-2.0.2.css`
- Missing source/public path: `/legacy/prisoner/assets/js/jquery.loading-indicator.js`

## 12. Exact Next Coding Step

After review, Phase 1.6 should verify `frontend/public/legacy/prisoner` remains free of `.php`, `.env`, `.sql`, and `db.php`, then remove only unreferenced junk files such as `assets1/scss/Readme.txt` if confirmed safe. Phase 1.5 should make targeted asset decisions for the logo and fallback prisoner image, preferably using existing `/legacy/logos/logo.png` and `/legacy/landing/images.png` unless role-local copies are desired. Phase 2 should convert only the Dashtreme layout shell into `PrisonerLayout`, `PrisonerNavbar`, `PrisonerSidebar`, `PrisonerFooter`, `/prisoner` redirect, and a placeholder `/prisoner/dashboard` page, with CSS scoped to `app/prisoner/layout.tsx` and React state replacing old jQuery/sidebar/dropdown behavior.
