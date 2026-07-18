# Officer Dashboard UI Migration Plan

## Short Summary

- The old officer dashboard is a DeskApp-style PHP/MySQL page, not the Sneat layout used by the visitor dashboard.
- The main visual assets are already mostly available under `frontend/public/legacy/officer`.
- It is not safe to start component conversion before cleanup because PHP files currently exist under `frontend/public/legacy/officer/includes`.
- Biggest asset gap: `frontend/officer/officer.png` is referenced by the navbar but is not currently exposed under `public/legacy/officer`.
- The backend officer dashboard API does not exactly match the old PHP dashboard cards. The old UI counts appointment visit status values, but the new backend returns prisoner, appointment status, and parole request counts.
- First safe next step after this analysis is Phase 1.6 public-folder cleanup, plus a very small Phase 1.5 copy for the missing `officer.png` asset if approved.

## 1. Old Layout Files Used

Main dashboard source:

- `frontend/officer/index.php`

Files directly included by `index.php`:

- `frontend/officer/navbar.php`
- `frontend/officer/sidebar.php`
- `frontend/officer/db.php`

Other officer files inspected as related legacy layout/reference files:

- `frontend/officer/includes/header.php`
- `frontend/officer/includes/footer.php`

Important finding:

- `frontend/officer/index.php` does not include `includes/header.php` or `includes/footer.php`.
- `includes/header.php` and `includes/footer.php` appear to be from the public landing/Dewi template, not the DeskApp officer dashboard shell.
- The officer dashboard shell is assembled by `index.php` loading `navbar.php`, `sidebar.php`, and then rendering its own dashboard content inside `<div class="main-container">`.

## 2. Old CSS/JS Assets Required

CSS files referenced by `frontend/officer/index.php`:

- `frontend/officer/vendors/styles/core.css`
- `frontend/officer/vendors/styles/icon-font.min.css`
- `frontend/officer/src/plugins/datatables/css/dataTables.bootstrap4.min.css`
- `frontend/officer/src/plugins/datatables/css/responsive.bootstrap4.min.css`
- External Bootstrap CDN: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css`
- `frontend/officer/vendors/styles/style.css`
- External Google Font: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap`

JS files referenced by `frontend/officer/index.php`:

- `frontend/officer/vendors/scripts/core.js`
- `frontend/officer/vendors/scripts/script.min.js`
- `frontend/officer/vendors/scripts/process.js`
- `frontend/officer/vendors/scripts/layout-settings.js`
- `frontend/officer/src/plugins/apexcharts/apexcharts.min.js`
- `frontend/officer/src/plugins/datatables/js/jquery.dataTables.min.js`
- `frontend/officer/src/plugins/datatables/js/dataTables.bootstrap4.min.js`
- `frontend/officer/src/plugins/datatables/js/dataTables.responsive.min.js`
- `frontend/officer/src/plugins/datatables/js/responsive.bootstrap4.min.js`
- `frontend/officer/vendors/scripts/dashboard.js`
- External Font Awesome kit: `https://kit.fontawesome.com/a076d05399.js`
- External Google Analytics script: `https://www.googletagmanager.com/gtag/js?id=UA-119386393-1`

Current public availability check:

- `/legacy/officer/vendors/styles/core.css` exists.
- `/legacy/officer/vendors/styles/icon-font.min.css` exists.
- `/legacy/officer/vendors/styles/style.css` exists.
- `/legacy/officer/src/plugins/datatables/css/dataTables.bootstrap4.min.css` exists.
- `/legacy/officer/src/plugins/datatables/css/responsive.bootstrap4.min.css` exists.
- `/legacy/officer/vendors/scripts/core.js` exists.
- `/legacy/officer/vendors/scripts/script.min.js` exists.
- `/legacy/officer/vendors/scripts/process.js` exists.
- `/legacy/officer/vendors/scripts/layout-settings.js` exists.
- `/legacy/officer/src/plugins/apexcharts/apexcharts.min.js` exists.
- `/legacy/officer/src/plugins/datatables/js/jquery.dataTables.min.js` exists.
- `/legacy/officer/vendors/scripts/dashboard.js` exists.

Recommended CSS loading for Next.js:

- Load the DeskApp CSS only inside `app/officer/layout.tsx`, not globally.
- Required layout CSS should likely be:
  - `/legacy/officer/vendors/styles/core.css`
  - `/legacy/officer/vendors/styles/icon-font.min.css`
  - `/legacy/officer/vendors/styles/style.css`
- Datatables CSS is not required for the dashboard cards in Phase 2/3 unless future officer table pages are migrated.

Recommended JS strategy:

- Do not blindly load all old JS.
- Reimplement sidebar/menu/dropdown behavior with React state where feasible.
- Avoid Google Analytics and old dashboard demo scripts during migration unless a visual behavior truly depends on them.

## 3. Images/Icons/Fonts Required

Images directly referenced by the old dashboard shell:

- `frontend/officer/vendors/images/apple-touch-icon.png`
- `frontend/officer/vendors/images/favicon-32x32.png`
- `frontend/officer/vendors/images/favicon-16x16.png`
- `frontend/officer/officer.png`
- `frontend/jmlogo.png`, referenced from `frontend/officer/sidebar.php` as `../jmlogo.png`

Current public paths confirmed:

- `/legacy/officer/vendors/images/apple-touch-icon.png` exists.
- `/legacy/officer/vendors/images/favicon-32x32.png` exists.
- `/legacy/officer/vendors/images/favicon-16x16.png` exists.
- `/legacy/logos/jmlogo.png` exists.

Missing or not currently exposed at the expected officer legacy path:

- Expected: `/legacy/officer/officer.png`
- Source exists at: `frontend/officer/officer.png`
- Current status: missing from `frontend/public/legacy/officer/officer.png`

Icon/font assets needed by DeskApp classes:

- `frontend/officer/vendors/fonts/dropways.*`
- `frontend/officer/vendors/fonts/fontawesome-webfont.*`
- `frontend/officer/vendors/fonts/foundation-icons.*`
- `frontend/officer/vendors/fonts/ionicons.*`
- `frontend/officer/vendors/fonts/themify.*`
- `frontend/officer/src/fonts/dropways`
- `frontend/officer/src/fonts/font-awesome`
- `frontend/officer/src/fonts/foundation-icons`
- `frontend/officer/src/fonts/ionicons-master`
- `frontend/officer/src/fonts/themify-icons`

Current public availability:

- `/legacy/officer/vendors/fonts/...` exists.
- `/legacy/officer/src/fonts/...` exists.

## 4. Sidebar/Navbar/Header/Footer Structure

Assembly in old PHP:

- `index.php` starts the PHP session, checks authentication, then includes `navbar.php`, `sidebar.php`, and `db.php`.
- After includes, `index.php` renders a complete HTML document and the dashboard content inside `<div class="main-container">`.
- Because `navbar.php` and `sidebar.php` output markup before `<!DOCTYPE html>`, the legacy HTML structure is technically malformed, but browsers still render it.

Navbar structure from `frontend/officer/navbar.php`:

- Root wrapper: `<div class="header">`
- Left side:
  - Menu toggle icon: `.menu-icon.dw.dw-menu`
  - Search toggle icon: `.search-toggle-icon.dw.dw-search2`
  - Header search dropdown shell
- Right side:
  - Empty notification dropdown shell
  - User info dropdown:
    - User image: `officer.png`
    - User name from `$_SESSION['ofname']`
    - Dropdown items for ID, email, profile, settings, logout

Sidebar structure from `frontend/officer/sidebar.php`:

- Right layout settings panel: `.right-sidebar`
- Main left sidebar: `.left-side-bar`
- Brand logo section:
  - Link to `index.php`
  - Logo image from `../jmlogo.png`
- Menu container: `.menu-block.customscroll`
- Main menu list: `#accordion-menu`
- Menu items:
  - Home
  - Bookings dropdown
    - New Appointment
    - Accepted
    - Rejected
    - All
  - Prisoners
  - FIR
  - Parole dropdown
    - Parole Requests
    - Pending
    - Accepted
    - Rejected
- Mobile overlay: `.mobile-menu-overlay`

Footer:

- No dashboard footer is included by `index.php`.
- `frontend/officer/includes/footer.php` exists, but it belongs to the Dewi landing template and should not be used for the officer dashboard shell.
- For Phase 2, `OfficerFooter` can be a small empty/no-op wrapper or a minimal footer only if needed by the DeskApp layout, but it should not import the Dewi footer.

## 5. PHP Code To Remove

From `frontend/officer/index.php`:

- `session_start();`
- Authentication check:
  - `if (!isset($_SESSION['id'])) { header("Location: officerlogin.php"); exit(); }`
- Includes:
  - `include('navbar.php');`
  - `include('sidebar.php');`
  - `include('db.php');`
- Session-derived values:
  - `$logged_in_username = isset($_SESSION['ofname']) ? $_SESSION['ofname'] : 'Officer';`
  - `$logged_in_email = isset($_SESSION['ofemail']) ? $_SESSION['ofemail'] : '';`
  - `$logged_in_id = isset($_SESSION['id']) ? $_SESSION['id'] : '';`
- MySQL count variables:
  - `$total_appointments`
  - `$visited_count`
  - `$not_visited_count`
  - `$rejected_count`
  - `$pending_count`
  - `$accepted_count`
- Raw SQL queries:
  - `SELECT COUNT(*) as total FROM appointments`
  - `SELECT COUNT(*) as count FROM appointments WHERE visit_status = 'Visited'`
  - `SELECT COUNT(*) as count FROM appointments WHERE visit_status = 'Not Visited'`
  - `SELECT COUNT(*) as count FROM appointments WHERE accept = 'Rejected'`
  - `SELECT COUNT(*) as count FROM appointments WHERE accept = 'Pending'`
  - `SELECT COUNT(*) as count FROM appointments WHERE accept = 'Accepted'`
- MySQL calls:
  - `mysqli_query($connection, $query)`
  - `mysqli_fetch_assoc($result)`
  - `mysqli_close($connection)`
- PHP echo blocks in dashboard:
  - `htmlspecialchars($logged_in_username)`
  - `htmlspecialchars($logged_in_email)`
  - `htmlspecialchars($logged_in_id)`
  - `$total_appointments`
  - `$visited_count`
  - `$not_visited_count`
  - `$rejected_count`
  - `$pending_count`
  - `$accepted_count`

From `frontend/officer/navbar.php`:

- Session guard:
  - `if (session_status() == PHP_SESSION_NONE) { session_start(); }`
- Session-derived user dropdown data:
  - `$_SESSION['ofname']`
  - `$_SESSION['id']`
  - `$_SESSION['ofemail']`
- PHP echo and `htmlspecialchars(...)` calls.

From `frontend/officer/db.php`:

- Old MySQL connection settings.
- `new mysqli(...)`.
- Connection error handling with `die(...)`.
- PHP error display settings.

Credential note:

- `db.php` contains old local MySQL/XAMPP-style database connection settings.
- It does not reference the new Neon PostgreSQL setup.
- The actual credential values should not be served publicly or reused.

## 6. Dynamic Dashboard Data

Old dynamic identity data:

- Welcome name:
  - Displayed in `index.php` alert.
  - Source: `$_SESSION['ofname']`, fallback `Officer`.
- Email:
  - Displayed in `index.php` alert and navbar dropdown.
  - Source: `$_SESSION['ofemail']`.
- Officer ID:
  - Displayed in `index.php` alert and navbar dropdown.
  - Source: `$_SESSION['id']`.
- Navbar display name:
  - Source: `$_SESSION['ofname']`, fallback `Officer`.

Old dynamic dashboard cards:

- Total Appointments:
  - Source SQL: `SELECT COUNT(*) as total FROM appointments`
  - Old variable: `$total_appointments`
- Visited:
  - Source SQL: `SELECT COUNT(*) as count FROM appointments WHERE visit_status = 'Visited'`
  - Old variable: `$visited_count`
- Not Visited:
  - Source SQL: `SELECT COUNT(*) as count FROM appointments WHERE visit_status = 'Not Visited'`
  - Old variable: `$not_visited_count`
- Rejected:
  - Source SQL: `SELECT COUNT(*) as count FROM appointments WHERE accept = 'Rejected'`
  - Old variable: `$rejected_count`
- Pending:
  - Source SQL: `SELECT COUNT(*) as count FROM appointments WHERE accept = 'Pending'`
  - Old variable: `$pending_count`
- Accepted:
  - Source SQL: `SELECT COUNT(*) as count FROM appointments WHERE accept = 'Accepted'`
  - Old variable: `$accepted_count`

## 7. Matching Backend API Fields

Source of truth inspected:

- `backend/src/modules/dashboard/dashboard.service.ts`

GET `/api/dashboard/officer` returns exactly:

- `totalPrisoners`
- `pendingAppointments`
- `approvedAppointments`
- `rejectedAppointments`
- `pendingParoleRequests`

Cross-reference against old PHP dashboard data:

| Old PHP data/card | Old source | New backend equivalent | Migration note |
| --- | --- | --- | --- |
| Total Appointments | `COUNT(*) FROM appointments` | No exact field | Backend does not currently return total appointments for officer. Do not guess. Either omit, display `0`, or request backend addition in a later API change. |
| Visited | `visit_status = 'Visited'` | No equivalent | Backend dashboard API has no visit-status count. |
| Not Visited | `visit_status = 'Not Visited'` | No equivalent | Backend dashboard API has no visit-status count. |
| Rejected | `accept = 'Rejected'` | `rejectedAppointments` | Use `rejectedAppointments`. |
| Pending | `accept = 'Pending'` | `pendingAppointments` | Use `pendingAppointments`. |
| Accepted | `accept = 'Accepted'` | `approvedAppointments` | Use `approvedAppointments`; the backend field is not called `acceptedAppointments`. |
| Prisoners | Not shown on old dashboard cards | `totalPrisoners` | New backend has this field; it can be shown using the old card style. |
| Pending parole requests | Not shown on old dashboard cards | `pendingParoleRequests` | New backend has this field; it can be shown using the old card style. |

Important implementation warning:

- Use `approvedAppointments`, not `acceptedAppointments`.
- The frontend should default missing values to `0`, but it should not silently invent fields not returned by the backend.

## 8. New Component Breakdown

Recommended components:

- `components/legacy/officer/OfficerLayout.tsx`
  - Owns the DeskApp page wrapper.
  - Renders `OfficerNavbar`, `OfficerSidebar`, child content, and optional footer.
  - Manages sidebar/menu state if React-driven behavior is needed.
- `components/legacy/officer/OfficerNavbar.tsx`
  - Converts `navbar.php`.
  - Receives user identity props or reads from a shared auth/me flow in the page/layout.
  - Removes PHP sessions and old logout link.
- `components/legacy/officer/OfficerSidebar.tsx`
  - Converts `sidebar.php`.
  - Keeps old DeskApp classes and menu hierarchy.
  - Replaces `.php` links with future Next.js routes.
- `components/legacy/officer/OfficerFooter.tsx`
  - Minimal placeholder/no-op unless a DeskApp footer is later identified.
  - Do not use the Dewi `includes/footer.php`.
- `app/officer/dashboard/page.tsx`
  - Phase 2: placeholder only.
  - Phase 3: dashboard cards plus API fetch.
- Optional future component:
  - `components/legacy/officer/OfficerDashboardCards.tsx`

## 9. New Route Structure

Immediate routes for this task:

- `/officer`
  - Redirect to `/officer/dashboard`.
- `/officer/dashboard`
  - Migrated officer dashboard.

Future officer module route map:

- Old `frontend/officer/index.php` -> `/officer/dashboard`
- Old `frontend/officer/newappointment.php` -> `/officer/appointments/new`
- Old `frontend/officer/accepted.php` -> `/officer/appointments/accepted`
- Old `frontend/officer/rejected.php` -> `/officer/appointments/rejected`
- Old `frontend/officer/all.php` -> `/officer/appointments`
- Old `frontend/officer/prisoners.php` -> `/officer/prisoners`
- Old `frontend/officer/fir.php` -> `/officer/fir`
- Old `frontend/officer/requests.php` -> `/officer/parole/requests`
- Old `frontend/officer/pendingparole.php` -> `/officer/parole/pending`
- Old `frontend/officer/acceptedparole.php` -> `/officer/parole/accepted`
- Old `frontend/officer/rejectedparole.php` -> `/officer/parole/rejected`
- Old `frontend/officer/of_profile.php` -> `/officer/profile`
- Old `frontend/officer/profile_edit.php` -> `/officer/profile/settings`

## 10. Public Asset Copy/Exposure Needs

Already exposed under `frontend/public/legacy/officer`:

- `assets/`
- `src/`
- `vendors/`

These folders contain the required DeskApp CSS, JS, images, fonts, and plugins for the officer dashboard shell.

Missing asset that needs copying if Phase 1.5 is approved:

- Source: `frontend/officer/officer.png`
- Target: `frontend/public/legacy/officer/officer.png`
- New public path: `/legacy/officer/officer.png`

Logo asset:

- Source old reference: `../jmlogo.png`
- Existing public file: `frontend/public/legacy/logos/jmlogo.png`
- Recommended new path: `/legacy/logos/jmlogo.png`
- No copy is strictly required for `jmlogo.png` unless we want a duplicate under `/legacy/officer`.

No broad asset-folder copy appears necessary at this point because `assets`, `src`, and `vendors` already exist in the public legacy officer folder.

## 11. Risky Files That Must NOT Be Copied To Public

Risky files found under `frontend/officer`:

- `frontend/officer/db.php`
- `frontend/officer/index.php`
- `frontend/officer/navbar.php`
- `frontend/officer/sidebar.php`
- `frontend/officer/officerlogin.php`
- `frontend/officer/accepted.php`
- `frontend/officer/acceptedparole.php`
- `frontend/officer/accept_parole.php`
- `frontend/officer/action.php`
- `frontend/officer/add_prisoner.php`
- `frontend/officer/all.php`
- `frontend/officer/delete_prisoner.php`
- `frontend/officer/eligibility.php`
- `frontend/officer/fir.php`
- `frontend/officer/log_prisoner_detail.php`
- `frontend/officer/newappointment.php`
- `frontend/officer/of_profile.php`
- `frontend/officer/parole.php`
- `frontend/officer/parole_report.php`
- `frontend/officer/pendingparole.php`
- `frontend/officer/prisoners.php`
- `frontend/officer/profile_edit.php`
- `frontend/officer/rejected.php`
- `frontend/officer/rejectedparole.php`
- `frontend/officer/reject_parole.php`
- `frontend/officer/requests.php`
- `frontend/officer/update_prisoner.php`
- `frontend/officer/includes/header.php`
- `frontend/officer/includes/footer.php`

Template/tooling files found under `frontend/officer` that should not be copied to public:

- `frontend/officer/package.json`
- `frontend/officer/package-lock.json`
- `frontend/officer/gulpfile.js`
- `frontend/officer/README.md`
- `frontend/officer/LICENSE`
- `frontend/officer/CODE_OF_CONDUCT.md`
- `frontend/officer/ISSUE_TEMPLATE.md`
- `frontend/officer/.DS_Store`

Risky files already found under `frontend/public/legacy/officer`:

- `frontend/public/legacy/officer/includes/header.php`
- `frontend/public/legacy/officer/includes/footer.php`

Other public cleanup candidates:

- `frontend/public/legacy/officer/assets/.DS_Store`
- `frontend/public/legacy/officer/src/.DS_Store`
- `frontend/public/legacy/officer/src/plugins/.DS_Store`
- `frontend/public/legacy/officer/vendors/.DS_Store`
- `frontend/public/legacy/officer/assets/scss/Readme.txt`

Credential note:

- `frontend/officer/db.php` contains old local MySQL credentials/settings and must remain non-public.

## 12. Risks And Missing Assets

Risks:

- The old DeskApp JS expects traditional DOM loading and jQuery-style behavior. Blindly loading `core.js`, `script.min.js`, `process.js`, `layout-settings.js`, and `dashboard.js` in Next.js may cause hydration or route-leak issues.
- The old template uses `data-toggle="dropdown"` and similar Bootstrap/jQuery-era attributes. These should be reimplemented in React where possible.
- The old dashboard includes external Bootstrap 5 CDN while DeskApp may already bring Bootstrap-compatible styles/scripts. Loading additional global Bootstrap CSS could affect other routes if not scoped.
- Font Awesome dashboard card icons use `fas fa-...` classes and an external kit. If the kit is not loaded, the icons may not render. Safer options are to use available DeskApp/icon-font classes where visually acceptable or load the kit only in the officer route.
- `index.php` outputs include markup before the document root. The Next.js conversion must normalize this into a valid layout while preserving visual order.
- The old dashboard has six cards; the backend currently exposes five fields, and only three old appointment-status cards map directly.
- `officer.png` is missing from `public/legacy/officer`.
- PHP files are currently exposed in `public/legacy/officer/includes`, so cleanup should happen before coding.

Missing assets:

- Missing public path: `/legacy/officer/officer.png`
- Existing source path: `frontend/officer/officer.png`

No missing required DeskApp CSS/JS/font folder was found for the main dashboard shell.

## 13. Exact Next Coding Step

Before converting components, run Phase 1.6 public-folder safety cleanup because PHP files are already present under `frontend/public/legacy/officer/includes`. Also run the minimal Phase 1.5 asset exposure step for the single missing visual asset `officer.png`, copying it from `frontend/officer/officer.png` to `frontend/public/legacy/officer/officer.png`. No broad folder copy is needed because `assets`, `src`, and `vendors` are already present. After cleanup and the one-image copy, proceed to Phase 2 by converting only the DeskApp layout shell into `OfficerLayout`, `OfficerNavbar`, `OfficerSidebar`, `OfficerFooter`, and the `/officer` route wrapper, keeping the dashboard content as a placeholder until Phase 3.
