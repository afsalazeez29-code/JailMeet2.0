# JailMeet 2.0 Admin Dashboard UI Migration Plan

## Phase 1 Summary

The old admin dashboard is a messy but usable legacy PHP/Kaiadmin template. It is safe to start conversion after review, but the migration should be done carefully because layout HTML is split between `adindex.php`, `includes/navbar.php`, and `includes/sidebar.php`, while `navbar.php` also contains a second partial HTML document with duplicated CSS/script imports. The biggest risk is copying the legacy PHP structure too literally into Next.js and bringing along duplicated `<html>`, `<head>`, old MySQL/session code, and globally loaded demo scripts. The first coding step should be to convert only the admin shell into isolated reusable components, with no dashboard data fetching yet.

## 1. Old Layout Files Used

| File path | Used by `adindex.php`? | Purpose | Notes |
| --- | --- | --- | --- |
| `frontend/admin/adindex.php` | Yes | Main old admin dashboard page | Owns document shell, page title, dashboard content, stats cards, custom-template settings panel, and script includes. |
| `frontend/admin/includes/navbar.php` | Yes, via `include('includes/navbar.php')` | Top admin header/navbar and profile dropdown | Also starts session, includes `db.php`, reads admin session values, and incorrectly contains a second `<!DOCTYPE html><html><head>` fragment with duplicate CSS/JS imports. |
| `frontend/admin/includes/sidebar.php` | Yes, via `include('includes/sidebar.php')` | Left admin sidebar navigation | Contains logo/header strip, sidebar toggle buttons, and admin menu links. |
| `frontend/admin/db.php` | Indirectly yes, via `navbar.php` | Old MySQL connection | Must not be migrated into frontend. It creates a `mysqli` connection to local MySQL database `jailmeet` and enables PHP error reporting. |
| `frontend/admin/includes/header.php` | No | Legacy public/landing header include | Inspected because it is in the includes folder, but `adindex.php` does not include it. It appears to be for the public landing header, not the admin dashboard. |

No footer include is referenced by `adindex.php`. There is no `frontend/admin/includes/footer.php` in the inspected folder.

## 2. Old CSS/JS Assets Required

### Assets referenced by the active admin dashboard chain

| Legacy reference | New public path to use | Present in `public/legacy`? | Notes |
| --- | --- | --- | --- |
| `assets1/css/bootstrap.min.css` | `/legacy/admin/assets1/css/bootstrap.min.css` | Yes | Required Kaiadmin/Bootstrap styling. |
| `assets1/css/plugins.min.css` | `/legacy/admin/assets1/css/plugins.min.css` | Yes | Required plugin and icon styling. |
| `assets1/css/kaiadmin.min.css` | `/legacy/admin/assets1/css/kaiadmin.min.css` | Yes | Main admin template stylesheet. |
| `assets1/css/demo.css` | `/legacy/admin/assets1/css/demo.css` | Yes | Demo/custom-template styling. Old comments say not to include in production, but it affects faithful legacy appearance. |
| `assets1/css/fonts.min.css` | `/legacy/admin/assets1/css/fonts.min.css` | Yes | Loaded by WebFont for Font Awesome and simple-line-icons. |
| `assets1/js/plugin/webfont/webfont.min.js` | `/legacy/admin/assets1/js/plugin/webfont/webfont.min.js` | Yes | Used to load Public Sans, Font Awesome, and simple-line-icons. |
| `assets1/js/core/jquery-3.7.1.min.js` | `/legacy/admin/assets1/js/core/jquery-3.7.1.min.js` | Yes | Used by old scripts and sparkline snippet. |
| `assets1/js/core/popper.min.js` | `/legacy/admin/assets1/js/core/popper.min.js` | Yes | Bootstrap dependency. |
| `assets1/js/core/bootstrap.min.js` | `/legacy/admin/assets1/js/core/bootstrap.min.js` | Yes | Bootstrap JS behavior. |
| `assets1/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js` | `/legacy/admin/assets1/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js` | Yes | Sidebar/custom scrollbar behavior. |
| `assets1/js/plugin/chart.js/chart.min.js` | `/legacy/admin/assets1/js/plugin/chart.js/chart.min.js` | Yes | Included by old dashboard, but no visible chart canvas is present in current `adindex.php`. |
| `assets1/js/plugin/jquery.sparkline/jquery.sparkline.min.js` | `/legacy/admin/assets1/js/plugin/jquery.sparkline/jquery.sparkline.min.js` | Yes | Used by inline `#lineChart`, `#lineChart2`, `#lineChart3` sparkline calls, but those element IDs are not present in current dashboard markup. |
| `assets1/js/plugin/chart-circle/circles.min.js` | `/legacy/admin/assets1/js/plugin/chart-circle/circles.min.js` | Yes | Included by old dashboard; no matching visible chart-circle element found in `adindex.php`. |
| `assets1/js/plugin/datatables/datatables.min.js` | `/legacy/admin/assets1/js/plugin/datatables/datatables.min.js` | Yes | Included by old dashboard; no table appears in current dashboard markup. |
| `assets1/js/plugin/jsvectormap/jsvectormap.min.js` | `/legacy/admin/assets1/js/plugin/jsvectormap/jsvectormap.min.js` | Yes | Included by old dashboard; no visible map element found. |
| `assets1/js/plugin/jsvectormap/world.js` | `/legacy/admin/assets1/js/plugin/jsvectormap/world.js` | Yes | Included by old dashboard; no visible map element found. |
| `assets1/js/plugin/sweetalert/sweetalert.min.js` | `/legacy/admin/assets1/js/plugin/sweetalert/sweetalert.min.js` | Yes | Included by old dashboard; no dashboard-specific alert found. |
| `assets1/js/kaiadmin.min.js` | `/legacy/admin/assets1/js/kaiadmin.min.js` | Yes | Main Kaiadmin behavior, including sidebar/topbar interactions. |
| `assets1/js/setting-demo.js` | `/legacy/admin/assets1/js/setting-demo.js` | Yes | Drives the old custom-template color settings panel. Demo-only but used by old UI. |
| `assets1/js/demo.js` | `/legacy/admin/assets1/js/demo.js` | Yes | Demo methods. Included by old page. |

### Remote assets referenced by `navbar.php`

| Legacy reference | Present locally? | Recommendation |
| --- | --- | --- |
| `https://code.jquery.com/jquery-3.6.0.min.js` | Remote only | Do not duplicate if local `/legacy/admin/assets1/js/core/jquery-3.7.1.min.js` is loaded. |
| `https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css` | Remote only | Avoid in converted layout because local Bootstrap/Kaiadmin CSS is already present and this can conflict with Bootstrap 5-era classes. |

### Assets referenced only by unused `includes/header.php`

| Legacy reference | New public path to use if ever needed | Present in `public/legacy`? | Notes |
| --- | --- | --- | --- |
| `logo.png` | `/legacy/logos/logo.png` | Yes | Header include is not used by admin dashboard. |
| `assets/vendor/bootstrap/css/bootstrap.min.css` | `/legacy/admin/assets/vendor/bootstrap/css/bootstrap.min.css` | Yes | Public landing template asset, not active admin dashboard asset. |
| `assets/vendor/bootstrap-icons/bootstrap-icons.css` | `/legacy/admin/assets/vendor/bootstrap-icons/bootstrap-icons.css` | Yes | Public landing template asset, not active admin dashboard asset. |
| `assets/vendor/aos/aos.css` | `/legacy/admin/assets/vendor/aos/aos.css` | Yes | Public landing template asset, not active admin dashboard asset. |
| `assets/vendor/glightbox/css/glightbox.min.css` | `/legacy/admin/assets/vendor/glightbox/css/glightbox.min.css` | Yes | Public landing template asset, not active admin dashboard asset. |
| `assets/vendor/swiper/swiper-bundle.min.css` | `/legacy/admin/assets/vendor/swiper/swiper-bundle.min.css` | Yes | Public landing template asset, not active admin dashboard asset. |
| `assets/css/main.css` | `/legacy/admin/assets/css/main.css` | Yes | Public landing template asset, not active admin dashboard asset. |

## 3. Images/Icons Required

| Legacy reference | Used in | New public path to use | Present in `public/legacy`? | Notes |
| --- | --- | --- | --- | --- |
| `assets1/img/kaiadmin/favicon.ico` | `adindex.php`, `navbar.php` | `/legacy/admin/assets1/img/kaiadmin/favicon.ico` | Yes | Browser favicon. |
| `assets1/img/kaiadmin/logo_light.svg` | `navbar.php` | `/legacy/admin/assets1/img/kaiadmin/logo_light.svg` | Yes | Logo inside mobile/header logo area. |
| `../jmlogo.png` | `sidebar.php` | `/legacy/logos/jmlogo.png` | Yes | Source exists at `frontend/jmlogo.png`; copied under shared legacy logos, not under `/legacy/admin`. |
| `adminlogo.jpg` | `navbar.php` | Expected `/legacy/admin/adminlogo.jpg` | Missing | Source exists at `frontend/admin/adminlogo.jpg`, but it is not copied under `frontend/public/legacy`. This must be copied in a later coding phase or replaced with a no-broken-image fallback only if user approves. |
| Font Awesome icons: `fas fa-home`, `fas fa-user-circle`, `fas fa-th`, `fas fa-users`, `fas fa-user-check`, `fas fa-luggage-cart`, `far fa-check-circle`, `fa fa-search`, `fa fa-ellipsis-h` | `adindex.php`, `navbar.php`, `sidebar.php` | Served through `/legacy/admin/assets1/css/fonts.min.css` and `/legacy/admin/assets1/fonts/...` | Yes | Required for sidebar and dashboard card icons. |
| CSS.gg-style icons: `gg-menu-right`, `gg-menu-left`, `gg-more-vertical-alt` | `navbar.php`, `sidebar.php` | Served through Kaiadmin/plugins CSS | Yes | Used by sidebar/topbar toggle buttons. |
| `logo.png` | `includes/header.php` only | `/legacy/logos/logo.png` | Yes | Not used by the admin dashboard include chain. |

## 4. Sidebar/Navbar/Header/Footer Structure

`adindex.php` begins with PHP before the HTML document. It calls `include('includes/navbar.php')` and `include('includes/sidebar.php')` before emitting `<!DOCTYPE html>`. This means the included navbar/sidebar markup is assembled before the main document shell, which is invalid HTML but may have rendered in PHP because browsers are forgiving.

The old page structure is:

1. `adindex.php` starts PHP session and includes navbar/sidebar.
2. `navbar.php` outputs `<div class="main-panel">`, `<div class="main-header">`, a logo header, search bar, and profile dropdown.
3. `sidebar.php` outputs `<div class="sidebar" data-background-color="dark">` with the logo and menu links.
4. `adindex.php` outputs the main `<!DOCTYPE html>`, `<head>`, CSS links, then `<body><div class="wrapper">`.
5. Inside `.wrapper`, `adindex.php` renders `<div class="container" style="position:absolute; top:70px">` and `.page-inner`.
6. Dashboard content includes the title row, action buttons, welcome alert, four stats cards, and the Kaiadmin custom-template settings panel.
7. `adindex.php` closes with multiple JS includes and inline sparkline initialization.

Navbar details:

- Top-level wrapper is `.main-panel` with inline `width: 1200px`.
- Header area is `.main-header`.
- Logo block is `.main-header-logo > .logo-header[data-background-color="dark"]`.
- Search uses `.navbar-header-left`, `.navbar-form`, `.nav-search`, and a text input placeholder `Search ...`.
- Profile dropdown uses `.topbar-user.dropdown`, avatar image `adminlogo.jpg`, session-based username/email, profile/settings/logout links.
- The converted navbar should get admin display data from `/api/auth/me` or the login user object, not from PHP sessions.

Sidebar details:

- Top-level wrapper is `.sidebar[data-background-color="dark"]`.
- Logo block uses `../jmlogo.png`.
- Menu links:
  - `adindex.php` -> Dashboard
  - `userdetails.php` -> Visitors
  - `officersdetails.php` -> Officers
  - `admindetails.php` -> Admins
  - `prisonerdetails.php` -> Prisoners
  - `appointments.php` -> Appoinments (legacy spelling)
- Dashboard menu item is hardcoded `active`.
- Sidebar toggle buttons use `toggle-sidebar`, `sidenav-toggler`, and `topbar-toggler more`.

Header/footer:

- `includes/header.php` is not used by `adindex.php`.
- No footer file is included or found for the admin dashboard.

## 5. PHP Code To Remove

### `frontend/admin/adindex.php`

- Opening PHP block:
  - `session_start();`
  - `include('includes/navbar.php');`
  - `include('includes/sidebar.php');`
  - duplicate `session_start();`
  - `$logged_in_username = isset($_SESSION['ad_name']) ? $_SESSION['ad_name'] : 'Admin';`
  - `$logged_in_email = isset($_SESSION['ad_email']) ? $_SESSION['ad_email'] : '';`
  - `$logged_in_id = isset($_SESSION['ad_id']) ? $_SESSION['ad_id'] : '';`
- Dynamic echo:
  - `<?php echo htmlspecialchars($logged_in_id); ?>` in the welcome alert.
- No `mysqli` query, `SELECT`, `COUNT`, PHP redirect, or `header('Location...')` call was found in `adindex.php`.

### `frontend/admin/includes/navbar.php`

- Opening PHP block:
  - `session_start();`
  - `include('db.php');`
  - `$logged_in_username = isset($_SESSION['ad_name']) ? $_SESSION['ad_name'] : '';`
  - `$logged_in_email = isset($_SESSION['ad_email']) ? $_SESSION['ad_email'] : '';`
  - `$logged_in_id = isset($_SESSION['ad_id']) ? $_SESSION['ad_id'] : '';`
- Dynamic echoes:
  - `<?php echo htmlspecialchars($logged_in_username); ?>` in the topbar greeting.
  - `<?php if ($logged_in_id): ?> ... <?php endif; ?>` around a hidden admin id badge.
  - `<?php echo htmlspecialchars($logged_in_id); ?>` inside the hidden badge.
  - `<?php echo htmlspecialchars($logged_in_username); ?>` in dropdown user box.
  - `<?php echo htmlspecialchars($logged_in_email); ?>` in dropdown user box.
- No direct `mysqli` query, `SELECT`, `COUNT`, PHP redirect, or `header('Location...')` call was found in `navbar.php`, but it includes `db.php`.

### `frontend/admin/db.php`

- Entire file is frontend-incompatible and must be removed from migrated UI logic:
  - `$host = "localhost";`
  - `$user = "root";`
  - `$pass = "";`
  - `$dbname = "jailmeet";`
  - `$connection = new mysqli($host, $user, $pass, $dbname);`
  - `$connection->connect_error` check and `die(...)`
  - `error_reporting(E_ALL);`
  - `ini_set('display_errors', 1);`

### `frontend/admin/includes/sidebar.php`

- No PHP blocks found.

### `frontend/admin/includes/header.php`

- No PHP blocks found, and this file is not included by `adindex.php`.

## 6. Dynamic Dashboard Data

| Displayed data | Old source | Location | Dynamic? | Notes |
| --- | --- | --- | --- | --- |
| Admin username in topbar greeting | `$_SESSION['ad_name']`, escaped with `htmlspecialchars` | `includes/navbar.php` | Yes | Defaults to empty string in navbar. |
| Admin username in profile dropdown | `$_SESSION['ad_name']`, escaped with `htmlspecialchars` | `includes/navbar.php` | Yes | Same source as topbar greeting. |
| Admin email in profile dropdown | `$_SESSION['ad_email']`, escaped with `htmlspecialchars` | `includes/navbar.php` | Yes | Defaults to empty string. |
| Hidden admin id badge | `$_SESSION['ad_id']`, conditional on truthy value | `includes/navbar.php` | Yes | Rendered with `display: none`. |
| Welcome alert admin id | `$_SESSION['ad_id']`, escaped with `htmlspecialchars` | `adindex.php` | Yes | Displays `Welcome, Admin ID: ...`. |
| Visitors card value `1,294` | Hardcoded HTML | `adindex.php` | No | Label is `Visitors`; should map to real visitor count in Phase 3. |
| Subscribers card value `1303` | Hardcoded HTML | `adindex.php` | No | Looks like leftover Kaiadmin demo content. |
| Sales card value `$ 1,345` | Hardcoded HTML | `adindex.php` | No | Not relevant to JailMeet domain. |
| Order card value `576` | Hardcoded HTML | `adindex.php` | No | Likely demo content; may loosely correspond to appointments only after relabeling. |
| Search input | Static form input, no handler found | `includes/navbar.php` | No | UI-only currently. |
| Sparkline data arrays | Hardcoded inline JS arrays | `adindex.php` | No | Inline JS targets `#lineChart`, `#lineChart2`, `#lineChart3`, but no matching elements were found in the page markup. |

No dashboard tables or database-backed count queries are present in `adindex.php`.

## 7. Matching Backend API Fields

Actual `GET /api/dashboard/admin` response shape from `backend/src/modules/dashboard/dashboard.controller.ts` and `backend/src/modules/dashboard/dashboard.service.ts`:

```json
{
  "success": true,
  "message": "Admin dashboard retrieved successfully",
  "data": {
    "totalUsers": 0,
    "totalVisitors": 0,
    "totalOfficers": 0,
    "totalPrisoners": 0,
    "totalAppointments": 0,
    "pendingAppointments": 0,
    "pendingParoleRequests": 0
  }
}
```

Cross-reference:

| Old dashboard data point | Backend match? | Backend field | Migration note |
| --- | --- | --- | --- |
| Admin username | No, not in dashboard API | Use `/api/auth/me` or stored login user | Do not expect this from `/api/dashboard/admin`. |
| Admin email | No, not in dashboard API | Use `/api/auth/me` or stored login user | Needed for navbar profile dropdown. |
| Admin id | No, not in dashboard API | Use `/api/auth/me` or JWT/login user id | Needed if preserving welcome alert and hidden id badge. |
| Visitors card | Yes | `data.totalVisitors` | Replace hardcoded `1,294` with API value. |
| Subscribers card | No direct match | Possible `data.totalUsers`, but label mismatch | Should be flagged before Phase 3; if preserving card count count-style, relabeling may be needed. |
| Sales card | No | None | Demo-only and has no backend field. |
| Order card | Partial/mismatched | Possible `data.totalAppointments`, but label mismatch | Backend has `totalAppointments`; old label `Order` is not domain-correct. |
| Officers count | Backend has field, old UI lacks card | `data.totalOfficers` | Phase 3 may need an additional card or replace one demo card. |
| Prisoners count | Backend has field, old UI lacks card | `data.totalPrisoners` | Phase 3 may need an additional card or replace one demo card. |
| Pending appointments | Backend has field, old UI lacks card | `data.pendingAppointments` | Phase 3 needs a faithful-style card/summary item if requested. |
| Pending parole requests | Backend has field, old UI lacks card | `data.pendingParoleRequests` | Phase 3 needs a faithful-style card/summary item if requested. |
| Total users | Backend has field, old UI lacks direct card | `data.totalUsers` | Could replace `Subscribers`, but that changes text. Needs review. |

Important mismatch: the old visible dashboard has four demo cards, but the real backend returns seven admin stats. Phase 3 should preserve the old card visual style while adapting labels/content to JailMeet's real fields.

## 8. New Component Breakdown

Proposed components for Phase 2 and Phase 3:

| Component | Proposed path | Phase | Responsibility |
| --- | --- | --- | --- |
| `AdminLayout` | `frontend/components/legacy/admin/AdminLayout.tsx` | Phase 2 | Wraps admin pages with old `.wrapper`, sidebar, navbar, and main panel/page container structure. |
| `AdminNavbar` | `frontend/components/legacy/admin/AdminNavbar.tsx` | Phase 2 | Converts `includes/navbar.php` to JSX, removes PHP/session/db logic, preserves topbar/profile dropdown structure. |
| `AdminSidebar` | `frontend/components/legacy/admin/AdminSidebar.tsx` | Phase 2 | Converts `includes/sidebar.php` to JSX, preserves menu structure and legacy classes. |
| `AdminFooter` | `frontend/components/legacy/admin/AdminFooter.tsx` | Phase 2 | Placeholder/null component unless a footer is later discovered in another admin page. |
| `AdminLegacyScripts` or script strategy inside layout | `frontend/components/legacy/admin/AdminLegacyScripts.tsx` if needed | Phase 2 | Loads Kaiadmin scripts in safe order if they are required for sidebar/dropdown behavior. Prefer React state for simple toggles if feasible. |
| `AdminDashboardPage` | `frontend/app/admin/dashboard/page.tsx` | Phase 3 | Fetches `/api/dashboard/admin`, handles token/401/403/loading, renders dashboard content. |
| `AdminStatCard` | `frontend/components/legacy/admin/AdminStatCard.tsx` or inside page | Phase 3 | Reusable stat card preserving `card card-stats card-round`, icon bubble classes, and number layout. |
| `AdminSettingsPanel` | `frontend/components/legacy/admin/AdminSettingsPanel.tsx` | Phase 2 or 3 | Converts the old custom-template settings panel if preserving the template switcher is desired. |

## 9. New Route Structure

Proposed route structure:

| Route | File | Purpose |
| --- | --- | --- |
| `/admin` | `frontend/app/admin/page.tsx` optional redirect | Redirect to `/admin/dashboard` or provide a small admin landing placeholder. |
| `/admin/dashboard` | `frontend/app/admin/dashboard/page.tsx` | Converted admin dashboard summary view. |
| `/admin/visitors` | Future file | Replacement for `userdetails.php`. Not part of current migration phase. |
| `/admin/officers` | Future file | Replacement for `officersdetails.php`. Not part of current migration phase. |
| `/admin/admins` | Future file | Replacement for `admindetails.php`. Not part of current migration phase. |
| `/admin/prisoners` | Future file | Replacement for `prisonerdetails.php`. Not part of current migration phase. |
| `/admin/appointments` | Future file | Replacement for `appointments.php`. Not part of current migration phase. |
| `/admin/profile` | Future file | Replacement for `adminprofile.php`. Not part of current migration phase. |
| `/admin/settings` | Future file | Replacement for `profileedit.php`. Not part of current migration phase. |

Phase 2 should create `frontend/app/admin/layout.tsx` to apply the converted shell across `/admin/*` routes.

## 10. Risks And Missing Assets

Risks:

- `adindex.php` includes navbar/sidebar before the actual `<!DOCTYPE html>`, which is invalid document structure. The Next.js migration must correct assembly order while preserving visual output.
- `navbar.php` contains a second partial `<!DOCTYPE html><html><head>` block with duplicate stylesheet/script imports. This must not be copied into a component as-is.
- `navbar.php` includes `db.php`, creating a frontend-incompatible old MySQL dependency. This must be removed completely.
- The old admin dashboard cards are mostly Kaiadmin demo metrics (`Subscribers`, `Sales`, `Order`) rather than JailMeet data.
- The real backend admin dashboard returns seven stats, while the old visible UI has only four stat cards.
- Demo scripts `setting-demo.js` and `demo.js` may mutate DOM/classes globally. If loaded globally, they could interfere with the already converted landing/login pages.
- Existing root `app/layout.tsx` already globally loads landing legacy CSS. Admin CSS should be isolated to admin routes as much as Next.js allows, or carefully loaded only within `/admin`.
- Old links still point to PHP pages (`userdetails.php`, `officersdetails.php`, `adminlogin.php`, etc.). These need route mapping during conversion.
- `adminlogo.jpg` is missing from `frontend/public/legacy`, even though source exists at `frontend/admin/adminlogo.jpg`.
- No footer include exists, so any footer component should be null/placeholder unless another admin page later reveals one.

Missing or not-yet-copied assets:

| Asset | Source status | Public legacy status | Needed for |
| --- | --- | --- | --- |
| `frontend/admin/adminlogo.jpg` | Exists in legacy source | Missing from `frontend/public/legacy` | Navbar avatar and dropdown profile image. |

Assets present but path-adjustment needed:

| Asset | Current copied path | Needed conversion path |
| --- | --- | --- |
| `frontend/jmlogo.png` | `frontend/public/legacy/logos/jmlogo.png` | Use `/legacy/logos/jmlogo.png` instead of the old `../jmlogo.png`. |
| `frontend/logo.png` | `frontend/public/legacy/logos/logo.png` | Only needed if unused `includes/header.php` is ever migrated. |

## 11. Exact Next Coding Step

Phase 2 should convert only the old admin layout shell into Next.js components: create `components/legacy/admin/AdminLayout.tsx`, `AdminNavbar.tsx`, `AdminSidebar.tsx`, and a null/placeholder `AdminFooter.tsx`, then wire them through `app/admin/layout.tsx` with a placeholder `/admin/dashboard` page. It should remove all PHP/session/MySQL logic, correct the invalid document assembly, preserve Kaiadmin classes/structure/spacing, map old asset URLs to `/legacy/...`, and avoid implementing dashboard API fetching until Phase 3.
