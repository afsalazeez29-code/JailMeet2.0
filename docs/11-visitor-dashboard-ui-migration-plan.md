# JailMeet 2.0 Visitor Dashboard UI Migration Plan

## Phase 1 Summary

The old visitor dashboard is a Sneat/Boxicons-style PHP dashboard, not the same Kaiadmin shell used by the admin dashboard. It is migration-safe after review, but there is one major blocker to a faithful Phase 2 conversion: `frontend/public/legacy/visitor` currently appears empty, while the required visitor dashboard assets still live only in the old source tree under `frontend/visitor/visitorpage`. The biggest risks are old PHP session/MySQL logic in all three layout files, hardcoded `/Project/JailMeet` redirects, duplicated `<body>` tags, legacy jQuery/menu scripts that expect a traditional page load, and backend field naming mismatch between Prompt2's `acceptedAppointments` wording and the actual API field `approvedAppointments`. The first coding step after review should be to copy or otherwise expose the old visitor dashboard assets under `/public/legacy/visitor/...`, then convert only the visitor layout shell.

## 1. Old Layout Files Used

| File path | Used by `vhome.php`? | Purpose | Notes |
| --- | --- | --- | --- |
| `frontend/visitor/visitorpage/html/vhome.php` | Yes | Main old visitor dashboard page | Starts session, checks login, queries visitor name/email, includes navbar/sidebar, defines document head, renders welcome content, and loads CSS/JS. |
| `frontend/visitor/visitorpage/html/navbar.php` | Yes, via `include('navbar.php')` | Top navbar/profile dropdown | Starts session if needed, checks login, includes `db.php`, reads visitor id/email from session, renders avatar dropdown. |
| `frontend/visitor/visitorpage/html/sidebar.php` | Yes, via `include('sidebar.php')` | Left visitor menu/sidebar | Starts session if needed, includes `db.php`, queries visitor record, renders logo/menu links and hidden user-info block. |
| `frontend/visitor/visitorpage/html/db.php` | Indirectly yes | Old MySQL connection for included files | This is the actual `db.php` resolved by `include('db.php')` from `vhome.php`, `navbar.php`, and `sidebar.php`. Must not be migrated into frontend. |
| `frontend/visitor/db.php` | No direct include from `vhome.php` | Duplicate old MySQL connection | Same content as the `visitorpage/html/db.php`, but not the file resolved by the dashboard include chain. |

No footer include is referenced by `vhome.php`. There are `frontend/visitor/includes/header.php` and `frontend/visitor/includes/footer.php` files elsewhere, but they are not included by the old visitor dashboard source chain.

## 2. Old CSS/JS Assets Required

The old dashboard references assets relative to `frontend/visitor/visitorpage/html`, so `../assets/...` maps to `frontend/visitor/visitorpage/assets/...`.

### Required CSS/assets from `vhome.php`

| Legacy reference | Source path | Expected Next.js public path | Present in `public/legacy/visitor`? | Notes |
| --- | --- | --- | --- | --- |
| `../assets/img/favicon/favicon.ico` | `frontend/visitor/visitorpage/assets/img/favicon/favicon.ico` | `/legacy/visitor/visitorpage/assets/img/favicon/favicon.ico` | Missing | Source exists, but not copied to public legacy visitor folder. |
| `../assets/vendor/fonts/boxicons.css` | `frontend/visitor/visitorpage/assets/vendor/fonts/boxicons.css` | `/legacy/visitor/visitorpage/assets/vendor/fonts/boxicons.css` | Missing | Required for `bx` icons in navbar/sidebar. |
| `../assets/vendor/css/core.css` | `frontend/visitor/visitorpage/assets/vendor/css/core.css` | `/legacy/visitor/visitorpage/assets/vendor/css/core.css` | Missing | Main Sneat core CSS. |
| `../assets/vendor/css/theme-default.css` | `frontend/visitor/visitorpage/assets/vendor/css/theme-default.css` | `/legacy/visitor/visitorpage/assets/vendor/css/theme-default.css` | Missing | Theme styling. |
| `../assets/css/demo.css` | `frontend/visitor/visitorpage/assets/css/demo.css` | `/legacy/visitor/visitorpage/assets/css/demo.css` | Missing | Demo/layout styling. |
| `../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css` | `frontend/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css` | `/legacy/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css` | Missing | Used by menu scrolling behavior. |
| `../assets/vendor/libs/apex-charts/apex-charts.css` | `frontend/visitor/visitorpage/assets/vendor/libs/apex-charts/apex-charts.css` | `/legacy/visitor/visitorpage/assets/vendor/libs/apex-charts/apex-charts.css` | Missing | Loaded by old dashboard; current visible dashboard content does not show charts. |

### Required JS from `vhome.php`

| Legacy reference | Source path | Expected Next.js public path | Present in `public/legacy/visitor`? | Notes |
| --- | --- | --- | --- | --- |
| `../assets/vendor/js/helpers.js` | `frontend/visitor/visitorpage/assets/vendor/js/helpers.js` | `/legacy/visitor/visitorpage/assets/vendor/js/helpers.js` | Missing | Old template helper. |
| `../assets/js/config.js` | `frontend/visitor/visitorpage/assets/js/config.js` | `/legacy/visitor/visitorpage/assets/js/config.js` | Missing | Old template config. |
| `../assets/vendor/libs/jquery/jquery.js` | `frontend/visitor/visitorpage/assets/vendor/libs/jquery/jquery.js` | `/legacy/visitor/visitorpage/assets/vendor/libs/jquery/jquery.js` | Missing | Old jQuery dependency. |
| `../assets/vendor/libs/popper/popper.js` | `frontend/visitor/visitorpage/assets/vendor/libs/popper/popper.js` | `/legacy/visitor/visitorpage/assets/vendor/libs/popper/popper.js` | Missing | Bootstrap dependency. |
| `../assets/vendor/js/bootstrap.js` | `frontend/visitor/visitorpage/assets/vendor/js/bootstrap.js` | `/legacy/visitor/visitorpage/assets/vendor/js/bootstrap.js` | Missing | Bootstrap behavior. |
| `../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js` | `frontend/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js` | `/legacy/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js` | Missing | Sidebar scroll behavior. |
| `../assets/vendor/js/menu.js` | `frontend/visitor/visitorpage/assets/vendor/js/menu.js` | `/legacy/visitor/visitorpage/assets/vendor/js/menu.js` | Missing | Old menu/sidebar behavior. |
| `../assets/vendor/libs/apex-charts/apexcharts.js` | `frontend/visitor/visitorpage/assets/vendor/libs/apex-charts/apexcharts.js` | `/legacy/visitor/visitorpage/assets/vendor/libs/apex-charts/apexcharts.js` | Missing | Old chart library; visible `vhome.php` content does not contain a chart target. |
| `../assets/js/main.js` | `frontend/visitor/visitorpage/assets/js/main.js` | `/legacy/visitor/visitorpage/assets/js/main.js` | Missing | Old template main JS. |
| `../assets/js/dashboards-analytics.js` | `frontend/visitor/visitorpage/assets/js/dashboards-analytics.js` | `/legacy/visitor/visitorpage/assets/js/dashboards-analytics.js` | Missing | Old dashboard analytics/demo JS; may expect chart DOM nodes not present after conversion. |
| `https://buttons.github.io/buttons.js` | Remote | Remote only | Remote only | GitHub buttons script from template; likely unnecessary for JailMeet visitor dashboard. |

### Remote font references

| Legacy reference | Present locally? | Recommendation |
| --- | --- | --- |
| `https://fonts.googleapis.com` and `https://fonts.gstatic.com` preconnects | Remote only | Can remain in route/layout metadata or document head if preserving exact typography. |
| Google font `Public Sans` URL | Remote only | Required to match old Sneat typography unless bundled locally later. |

## 3. Images/Icons Required

| Legacy reference | Used in | Source path | Expected Next.js public path | Present in `public/legacy/visitor`? | Notes |
| --- | --- | --- | --- | --- | --- |
| `userlogo.webp` | `navbar.php` | `frontend/visitor/visitorpage/html/userlogo.webp` | `/legacy/visitor/visitorpage/html/userlogo.webp` | Missing | Visitor avatar in navbar dropdown. Source exists. |
| `jmblack.png` | `sidebar.php` | `frontend/visitor/visitorpage/html/jmblack.png` | `/legacy/visitor/visitorpage/html/jmblack.png` | Missing | Sidebar logo. Source exists. |
| `../assets/img/avatars/1.png` | `sidebar.php` hidden user-info block | `frontend/visitor/visitorpage/assets/img/avatars/1.png` | `/legacy/visitor/visitorpage/assets/img/avatars/1.png` | Missing | Hidden in old page via `display: none`, but still part of old markup. Source exists. |
| `../assets/img/favicon/favicon.ico` | `vhome.php` | `frontend/visitor/visitorpage/assets/img/favicon/favicon.ico` | `/legacy/visitor/visitorpage/assets/img/favicon/favicon.ico` | Missing | Browser favicon. Source exists. |
| Boxicons classes: `bx bx-menu bx-sm`, `bx bx-user`, `bx bx-cog`, `bx bx-power-off`, `bx bx-home-circle`, `bx bx-cube-alt` | navbar/sidebar | `frontend/visitor/visitorpage/assets/vendor/fonts/boxicons.css` and font files | `/legacy/visitor/visitorpage/assets/vendor/fonts/...` | Missing | Source exists; must be copied to public legacy. |

## 4. Sidebar/Navbar/Header/Footer Structure

`vhome.php` starts with PHP before the HTML document:

1. Starts session.
2. Includes `db.php`.
3. Redirects to `/Project/JailMeet/visitor/login.php` if `$_SESSION['visitor_id']` is missing.
4. Queries the old MySQL `visitors` table for `vname` and `vemail`.
5. Sets default visitor name/email if the query returns no visitor.
6. Includes `navbar.php`.
7. Includes `sidebar.php`.
8. Outputs the full `<!DOCTYPE html>` document.

This is invalid assembly order for Next.js because the navbar/sidebar markup is emitted before the document shell. The converted layout should correct the order while preserving visual structure.

Main document/body structure in `vhome.php`:

- `<html lang="en" class="light-style layout-menu-fixed" dir="ltr" data-theme="theme-default" data-assets-path="../assets/" data-template="vertical-menu-template-free">`
- `<head>` loads favicon, Public Sans, Boxicons, core/theme/demo CSS, perfect-scrollbar CSS, apex-charts CSS, helpers JS, and config JS.
- There are duplicate `<body>` tags.
- Main wrapper:
  - `.layout-wrapper.layout-content-navbar`
  - `.layout-container`
  - `.layout-page`
  - `.content-wrapper`
  - `.container` with inline width and padding-top
- Content displays welcome/name/id/email/logout link.

Navbar structure from `navbar.php`:

- `<nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">`
- Inline styles:
  - `border-left-width: 10px`
  - `margin-left: 281px`
  - `margin-right: 22px`
  - `width: 1196px`
- Mobile menu toggle:
  - `.layout-menu-toggle`
  - link with `href="javascript:void(0)"`
  - icon `bx bx-menu bx-sm`
- Right aligned user dropdown:
  - `.navbar-nav-right`
  - `.dropdown-user`
  - avatar image `userlogo.webp`
  - dropdown item showing visitor email and visitor id
  - My Profile link with `profile.php?vid=<visitor_id>`
  - Settings link to `accountsettings.php`
  - Log Out link to `../../../index.php?logout=true`

Sidebar structure from `sidebar.php`:

- `<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">`
- Brand block `.app-brand.demo`
- Logo link to `home.php` with `jmblack.png`
- `.menu-inner-shadow`
- Hidden `.user-info.text-center.p-3` block with avatar, welcome name, visitor id, and visitor email
- Menu list:
  - Dashboard -> `vhome.php`
  - Pages header
  - View Prisoner -> `prisoners.php`
  - Book Appointment -> `booking.php`
  - View Booking Status -> `status.php`
  - Edit Profile -> `accountsettings.php`

Footer:

- No footer include or footer markup is used by `vhome.php`.
- A `VisitorFooter` component can be null/placeholder unless a future visitor page requires a footer.

## 5. PHP Code To Remove

### `frontend/visitor/visitorpage/html/vhome.php`

- `session_start();`
- `include('db.php');`
- Login/session guard:
  - `if (!isset($_SESSION['visitor_id'])) { header("Location: /Project/JailMeet/visitor/login.php"); exit(); }`
- Session read:
  - `$visitor_id = $_SESSION['visitor_id'];`
- Debug comments:
  - `// var_dump($_SESSION['visitor_id']);`
  - `// var_dump($visitor);`
- MySQL query:
  - `$query = "SELECT vname, vemail FROM visitors WHERE vid = ?";`
  - `mysqli_prepare($connection, $query);`
  - `die("Query failed: " . mysqli_error($connection));`
  - `mysqli_stmt_bind_param($stmt, "i", $visitor_id);`
  - `mysqli_stmt_execute($stmt);`
  - `mysqli_stmt_get_result($stmt);`
  - `mysqli_fetch_assoc($result);`
  - `mysqli_stmt_close($stmt);`
- Default visitor logic:
  - `$visitor_name = "Guest";`
  - `$visitor_email = "No email available";`
  - `$visitor_name = htmlspecialchars($visitor['vname']);`
  - `$visitor_email = htmlspecialchars($visitor['vemail']);`
- Includes:
  - `include('navbar.php');`
  - `include('sidebar.php');`
- Dynamic echoes:
  - `<?php echo $visitor_name; ?>`
  - `<?php echo htmlspecialchars($visitor_id); ?>`
  - `<?php echo $visitor_email; ?>`

### `frontend/visitor/visitorpage/html/navbar.php`

- Session start guard:
  - `if (session_status() === PHP_SESSION_NONE) { session_start(); }`
- Login/session guard:
  - `if (!isset($_SESSION['visitor_id'])) { header("Location: /Project/JailMeet/visitor/login.php"); exit(); }`
- `include('db.php');`
- Session reads:
  - `$visitor_id = $_SESSION['visitor_id'];`
  - `$visitor_email = $_SESSION['visitor_email'];`
- Dynamic echoes:
  - `<?php echo htmlspecialchars($visitor_email); ?>`
  - `<?php echo htmlspecialchars($visitor_id); ?>`
  - `<?php echo urlencode($visitor_id); ?>` in profile URL.

### `frontend/visitor/visitorpage/html/sidebar.php`

- Session start guard:
  - `if (session_status() === PHP_SESSION_NONE) { session_start(); }`
- `include('db.php');`
- Login/session guard:
  - `if (!isset($_SESSION['visitor_id'])) { header("Location: /Project/JailMeet/visitor/login.php"); exit(); }`
- Session read:
  - `$visitor_id = $_SESSION['visitor_id'];`
- MySQL query:
  - `$query = "SELECT vname, vemail, vpass FROM visitors WHERE vid = ?";`
  - `mysqli_prepare($connection, $query);`
  - `mysqli_stmt_bind_param($stmt, "i", $visitor_id);`
  - `mysqli_stmt_execute($stmt);`
  - `mysqli_stmt_get_result($stmt);`
  - `mysqli_fetch_assoc($result);`
  - `mysqli_stmt_close($stmt);`
- Visitor variables:
  - `$visitor_name`
  - `$visitor_email`
  - `$visitor_password`
- Important security note:
  - The old sidebar fetches `vpass`. No password field should ever be fetched or rendered in the Next.js migration.
- Dynamic echoes:
  - `<?php echo htmlspecialchars($visitor_name); ?>`
  - `<?php echo htmlspecialchars($visitor_id); ?>`
  - `<?php echo htmlspecialchars($visitor_email); ?>`

### `frontend/visitor/visitorpage/html/db.php`

- Entire file must be removed from the migrated UI logic:
  - `$host = "localhost";`
  - `$user = "root";`
  - `$pass = "";`
  - `$dbname = "jailmeet";`
  - `$connection = new mysqli($host, $user, $pass, $dbname);`
  - `$connection->connect_error` check and `die(...)`
  - `error_reporting(E_ALL);`
  - `ini_set('display_errors', 1);`

No `$_POST` or `$_GET` reads were found in the active visitor dashboard source chain, but `navbar.php` writes a profile URL using `?vid=...`.

## 6. Dynamic Dashboard Data

| Displayed data | Old source | Location | Dynamic? | Notes |
| --- | --- | --- | --- | --- |
| Welcome visitor name | Old MySQL query `SELECT vname, vemail FROM visitors WHERE vid = ?` using `$_SESSION['visitor_id']` | `vhome.php` | Yes | Defaults to `Guest` if no visitor row is found. |
| Visitor ID | `$_SESSION['visitor_id']` | `vhome.php`, `navbar.php`, `sidebar.php` hidden block | Yes | Used in visible welcome content and profile dropdown. |
| Visitor email in dashboard body | Old MySQL query result `vemail` | `vhome.php` | Yes | Defaults to `No email available`. |
| Visitor email in navbar dropdown | `$_SESSION['visitor_email']` | `navbar.php` | Yes | Different source than `vhome.php`; should be unified to `/api/auth/me` or login user data. |
| Visitor name/email/id in hidden sidebar user-info | Old MySQL query `SELECT vname, vemail, vpass FROM visitors WHERE vid = ?` and session id | `sidebar.php` | Yes, but hidden | Hidden via inline `display: none`. |
| Visitor password | Old MySQL query field `vpass` | `sidebar.php` | Yes, but not rendered | Must not be migrated. |
| Dashboard appointment counts | None | Not present in old visible content | No | The old `vhome.php` dashboard does not show appointment stat cards. |
| Logout link | Static URL `../../../index.php?logout=true` | `vhome.php`, `navbar.php` | Static old backend behavior | Must become token clear + `/login` redirect in Next.js. |

No old dashboard tables, appointment count cards, or appointment status counts were found in `vhome.php`.

## 7. Matching Backend API Fields

Actual `GET /api/dashboard/visitor` response shape from `backend/src/modules/dashboard/dashboard.controller.ts` and `backend/src/modules/dashboard/dashboard.service.ts`:

```json
{
  "success": true,
  "message": "Visitor dashboard retrieved successfully",
  "data": {
    "myAppointments": 0,
    "pendingAppointments": 0,
    "approvedAppointments": 0,
    "rejectedAppointments": 0
  }
}
```

Important field-name mismatch:

- Prompt2 expected checking `acceptedAppointments`.
- The actual backend returns `approvedAppointments`, not `acceptedAppointments`.
- Phase 3 should use the real field `approvedAppointments` unless the backend is deliberately changed later. This task says not to modify the backend.

Cross-reference:

| Old dashboard data point | Backend match? | Backend field | Migration note |
| --- | --- | --- | --- |
| Visitor name | No, not in dashboard API | Use `/api/auth/me` or stored login user | Needed for old welcome text. |
| Visitor email | No, not in dashboard API | Use `/api/auth/me` or stored login user | Needed for old body/navbar display. |
| Visitor ID | No, not in dashboard API | Use `/api/auth/me` user id or JWT/login user id | The old ID was numeric `vid`; new user id is likely a string UUID/CUID. |
| My appointments | New backend field, old UI lacks count card | `data.myAppointments` | Phase 3 should add card(s) using old visual style if stats are required. |
| Pending appointments | New backend field, old UI lacks count card | `data.pendingAppointments` | Phase 3 should display with old card/style pattern. |
| Approved appointments | New backend field, old UI lacks count card | `data.approvedAppointments` | This is the actual backend name. |
| Rejected appointments | New backend field, old UI lacks count card | `data.rejectedAppointments` | Phase 3 should display with old card/style pattern. |
| Accepted appointments | No actual backend field | None | Use `approvedAppointments` instead; do not silently invent `acceptedAppointments`. |

## 8. New Component Breakdown

| Component | Proposed path | Phase | Responsibility |
| --- | --- | --- | --- |
| `VisitorLayout` | `frontend/components/legacy/visitor/VisitorLayout.tsx` | Phase 2 | Wraps visitor pages with `.layout-wrapper`, `.layout-container`, sidebar, navbar, content wrapper, and any scoped visitor CSS/script loading. |
| `VisitorNavbar` | `frontend/components/legacy/visitor/VisitorNavbar.tsx` | Phase 2 | Converts `navbar.php` to JSX, removes PHP/session/db logic, preserves detached navbar/profile dropdown. |
| `VisitorSidebar` | `frontend/components/legacy/visitor/VisitorSidebar.tsx` | Phase 2 | Converts `sidebar.php` to JSX, preserves logo/menu structure and active link highlighting. |
| `VisitorFooter` | `frontend/components/legacy/visitor/VisitorFooter.tsx` | Phase 2 | Null/placeholder unless later visitor pages reveal footer markup. |
| `VisitorLegacyScripts` or layout-scoped script loader | `frontend/components/legacy/visitor/VisitorLegacyScripts.tsx` if needed | Phase 2 | Loads helper/config/menu/perfect-scrollbar JS safely after mount, or skips old JS if React state can replace the behavior. |
| `VisitorDashboardPage` | `frontend/app/visitor/dashboard/page.tsx` | Phase 3 | Fetches `/api/dashboard/visitor`, handles token/401/403/loading/error, renders dashboard content. |
| `VisitorStatCard` | `frontend/components/legacy/visitor/VisitorStatCard.tsx` or inside dashboard page | Phase 3 | Reusable card for `myAppointments`, `pendingAppointments`, `approvedAppointments`, `rejectedAppointments` using Sneat card/menu/icon classes. |

## 9. New Route Structure

| Route | File | Purpose |
| --- | --- | --- |
| `/visitor` | `frontend/app/visitor/page.tsx` optional redirect | Redirect to `/visitor/dashboard`. |
| `/visitor/dashboard` | `frontend/app/visitor/dashboard/page.tsx` | Converted visitor dashboard summary. |
| `/visitor/prisoners` | Future file | Replacement for `prisoners.php`. Not part of this task. |
| `/visitor/booking` | Future file | Replacement for `booking.php`. Not part of this task. |
| `/visitor/status` | Future file | Replacement for `status.php`. Not part of this task. |
| `/visitor/profile` | Future file | Replacement for `profile.php?vid=...`. Not part of this task. |
| `/visitor/settings` | Future file | Replacement for `accountsettings.php`. Not part of this task. |

Phase 2 should create `frontend/app/visitor/layout.tsx` so future visitor pages share the converted shell.

## 10. Risks And Missing Assets

Risks:

- `frontend/public/legacy/visitor` appears empty, so the current public asset copy is incomplete for this migration.
- `vhome.php` includes navbar/sidebar before the document shell, which must be corrected in Next.js.
- `vhome.php` has duplicate `<body>` tags.
- Every active layout file (`vhome.php`, `navbar.php`, `sidebar.php`) performs session checking and old `/Project/JailMeet/visitor/login.php` redirects.
- Old PHP directly queries MySQL and must be replaced with existing API calls.
- `sidebar.php` queries `vpass`; no password-related data should be fetched or represented in frontend migration.
- Old links target PHP files and must be mapped to Next routes.
- Old JS depends on jQuery, Bootstrap, perfect-scrollbar, menu.js, and potentially ApexCharts. These scripts may expect a traditional page load and may conflict with React if loaded globally.
- The old visible dashboard does not include stat cards, but the required new backend API has four appointment stats. Phase 3 must add these stats while preserving Sneat-style card visual language.
- Backend field mismatch: use `approvedAppointments`, not Prompt2's expected `acceptedAppointments`.

Missing public legacy assets that should be copied before or during Phase 2:

| Old source path | Expected public path |
| --- | --- |
| `frontend/visitor/visitorpage/assets/img/favicon/favicon.ico` | `/legacy/visitor/visitorpage/assets/img/favicon/favicon.ico` |
| `frontend/visitor/visitorpage/assets/vendor/fonts/boxicons.css` | `/legacy/visitor/visitorpage/assets/vendor/fonts/boxicons.css` |
| `frontend/visitor/visitorpage/assets/vendor/fonts/boxicons/*` | `/legacy/visitor/visitorpage/assets/vendor/fonts/boxicons/*` |
| `frontend/visitor/visitorpage/assets/vendor/css/core.css` | `/legacy/visitor/visitorpage/assets/vendor/css/core.css` |
| `frontend/visitor/visitorpage/assets/vendor/css/theme-default.css` | `/legacy/visitor/visitorpage/assets/vendor/css/theme-default.css` |
| `frontend/visitor/visitorpage/assets/css/demo.css` | `/legacy/visitor/visitorpage/assets/css/demo.css` |
| `frontend/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css` | `/legacy/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css` |
| `frontend/visitor/visitorpage/assets/vendor/libs/apex-charts/apex-charts.css` | `/legacy/visitor/visitorpage/assets/vendor/libs/apex-charts/apex-charts.css` |
| `frontend/visitor/visitorpage/assets/vendor/js/helpers.js` | `/legacy/visitor/visitorpage/assets/vendor/js/helpers.js` |
| `frontend/visitor/visitorpage/assets/js/config.js` | `/legacy/visitor/visitorpage/assets/js/config.js` |
| `frontend/visitor/visitorpage/assets/vendor/libs/jquery/jquery.js` | `/legacy/visitor/visitorpage/assets/vendor/libs/jquery/jquery.js` |
| `frontend/visitor/visitorpage/assets/vendor/libs/popper/popper.js` | `/legacy/visitor/visitorpage/assets/vendor/libs/popper/popper.js` |
| `frontend/visitor/visitorpage/assets/vendor/js/bootstrap.js` | `/legacy/visitor/visitorpage/assets/vendor/js/bootstrap.js` |
| `frontend/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js` | `/legacy/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js` |
| `frontend/visitor/visitorpage/assets/vendor/js/menu.js` | `/legacy/visitor/visitorpage/assets/vendor/js/menu.js` |
| `frontend/visitor/visitorpage/assets/vendor/libs/apex-charts/apexcharts.js` | `/legacy/visitor/visitorpage/assets/vendor/libs/apex-charts/apexcharts.js` |
| `frontend/visitor/visitorpage/assets/js/main.js` | `/legacy/visitor/visitorpage/assets/js/main.js` |
| `frontend/visitor/visitorpage/assets/js/dashboards-analytics.js` | `/legacy/visitor/visitorpage/assets/js/dashboards-analytics.js` |
| `frontend/visitor/visitorpage/html/userlogo.webp` | `/legacy/visitor/visitorpage/html/userlogo.webp` |
| `frontend/visitor/visitorpage/html/jmblack.png` | `/legacy/visitor/visitorpage/html/jmblack.png` |
| `frontend/visitor/visitorpage/assets/img/avatars/1.png` | `/legacy/visitor/visitorpage/assets/img/avatars/1.png` |

## 11. Exact Next Coding Step

Phase 2 should first make the old visitor dashboard assets available under `frontend/public/legacy/visitor/visitorpage/...` without deleting or moving the original PHP/source files, then convert only the layout shell into `VisitorLayout`, `VisitorNavbar`, `VisitorSidebar`, and `VisitorFooter`, wiring them through `app/visitor/layout.tsx` with a placeholder `/visitor/dashboard` page. It should remove all PHP/session/MySQL logic, map old asset URLs to `/legacy/visitor/...`, reimplement simple sidebar/dropdown toggles with React state/usePathname, and avoid backend dashboard fetching until Phase 3.
