# JailMeet 2.0 Frontend Current State Analysis

## Short Summary

- Frontend cleanliness: messy. The folder is mainly a copied legacy PHP/MySQL frontend plus Bootstrap/admin templates, not a clean Next.js app yet.
- Safe to start conversion: yes, if conversion starts by adding a proper Next.js scaffold beside the legacy references and avoids deleting or moving old files.
- Biggest risk: PHP pages mix UI markup with sessions, MySQL queries, redirects, hardcoded `/Project/JailMeet` paths, and relative asset paths. Copying markup directly into Next.js without separating logic would create broken routes and security issues.
- First thing to do: convert the old landing page `frontend/index.php` into `frontend/app/page.tsx` after setting up a real Next.js TypeScript scaffold, preserving the existing UI and legacy assets.

## 1. Current Frontend Folder Structure

Major folders found in `frontend`:

| Folder | What it seems to contain | Legacy or Next.js? |
| --- | --- | --- |
| `admin/` | Admin PHP pages, Kaiadmin template assets, admin includes, old DB file, admin dashboard, user/officer/prisoner management pages | Legacy PHP/UI |
| `assets/` | Landing/public site CSS, JS, images, vendor libraries such as Bootstrap, AOS, Swiper, Glightbox | Legacy public UI assets |
| `forms/` | PHP contact/newsletter handlers | Legacy PHP backend form handlers |
| `includes/` | Landing page header/footer PHP includes | Legacy PHP includes |
| `jailmeet-2-docs/` | Appears to be copied documentation/reference material | Legacy/reference |
| `officer/` | Officer PHP pages, Deskapp/admin template files, assets, plugins, uploads, package.json for old template tooling | Legacy PHP/UI |
| `prisoner/` | Prisoner PHP pages, dashboard assets, login/parole/status pages, includes | Legacy PHP/UI |
| `public/` | Contains `public/legacy/...`; no active Next.js public assets were confirmed outside legacy content | Partial future public asset area, currently legacy copy |
| `uploads/` | Uploaded media grouped by prisoners/review/visitors | Legacy uploaded media |
| `visitor/` | Visitor login/register PHP pages, profile pics, Sneat dashboard template under `visitorpage/` | Legacy PHP/UI |

Root-level legacy files:

- `index.php`: old landing page.
- `portfolio-details.html`, `service-details.html`, `starter-page.html`: Bootstrap template/static pages.
- `jailmeet.sql`: old MySQL database dump.
- Root images/video: `prison1.jpg`, `jailmeet_video.mp4`, `video_thumbnail.jpg`, `jmlogo.png`, `logo.png`, team/person images, prisoner images.

Actual Next.js folders found:

- No root `app/` folder found.
- No root `pages/` folder found.
- No root `src/` folder found.
- No root `components/` folder found.
- No root `lib/` folder found.
- `public/` exists, but it currently appears to hold copied legacy assets under `public/legacy`, not an active curated Next.js public structure.

## 2. Old Frontend Assets Found

Approximate file inventory by extension:

| Type | Count | Notes |
| --- | ---: | --- |
| `.svg` | 1179 | Mostly icons/vendor/template assets |
| `.js` | 845 | Vendor scripts, Bootstrap, jQuery, dashboard template JS |
| `.png` | 806 | Logos, icons, avatars, screenshots, placeholders |
| `.jpg` | 524 | Landing images, template images, profile/gallery images |
| `.css` | 396 | Bootstrap/template styles |
| `.map` | 319 | Source maps from vendor packages |
| `.html` | 135 | Template demo/static pages |
| `.scss` | 105 | Template source styles |
| `.php` | 79 | Legacy PHP pages/includes/actions |
| `.jpeg` | 58 | Images |
| fonts | 135+ | `.woff`, `.woff2`, `.ttf`, `.eot`, `.otf` |
| `.mp4` | 2 | Includes `jailmeet_video.mp4` |
| `.sql` | 1 | `jailmeet.sql` old MySQL dump |

Images:

- Root: `prison1.jpg`, `prisoner_img1.jpg`, `video_thumbnail.jpg`, `jmlogo.png`, `logo.png`, `images.png`, `prisoner.jpeg`, `prisoner2.jpeg`, `prisoner3.jpeg`, person images such as `afzal.jpg`.
- Landing assets: `assets/img/...`.
- Admin assets: `admin/assets/img/...`, `admin/assets1/img/...`.
- Officer assets: `officer/assets/img/...`, `officer/src/images/...`, `officer/vendors/images/...`.
- Prisoner assets: `prisoner/assets/images/...`, `prisoner/assets1/img/...`.
- Visitor assets: `visitor/assets/img/...`, `visitor/visitorpage/assets/img/...`, `visitor/visitorpage/html/slideshow/...`.

Videos:

- `jailmeet_video.mp4` at root.
- Another `.mp4` exists in the copied tree.

CSS files:

- Landing: `assets/css/main.css`.
- Admin: `admin/assets/css/main.css`, `admin/assets1/css/*.css`.
- Officer: `officer/assets/css/*`, `officer/src/styles/*`, `officer/vendors/styles/*`.
- Prisoner: `prisoner/assets/css/*`, `prisoner/assets1/css/*`.
- Visitor: `visitor/assets/css/*`, `visitor/visitorpage/assets/css/*`, `visitor/visitorpage/assets/vendor/css/*`.

JavaScript files:

- Landing: `assets/js/main.js`.
- Admin: `admin/assets/js/main.js`, `admin/assets1/js/*`.
- Officer: `officer/assets/js/*`, `officer/src/scripts/*`, `officer/vendors/scripts/*`.
- Prisoner: `prisoner/assets/js/*`, `prisoner/assets1/js/*`.
- Visitor: `visitor/visitorpage/assets/js/*`, `visitor/visitorpage/js/*`.

Bootstrap/vendor files:

- Bootstrap appears in multiple places: `assets/vendor/bootstrap`, `admin/assets/vendor/bootstrap`, `admin/assets1`, `officer/assets/vendor/bootstrap`, `officer/src/plugins/bootstrap`, `prisoner/assets`, `visitor/visitorpage/assets/vendor`.
- Other vendors include AOS, Bootstrap Icons, Glightbox, Swiper, Isotope, Purecounter, jQuery, Popper, Perfect Scrollbar, ApexCharts, Datatables, SweetAlert, Select2, Dropzone, FullCalendar, Highcharts, Boxicons.

Fonts/icons:

- Bootstrap Icons under `assets/vendor/bootstrap-icons`.
- Font Awesome/simple-line icons under `admin/assets1/fonts`.
- Font Awesome/Ionicons/Themify under `officer/src/fonts` and `officer/vendors/fonts`.
- Boxicons under `visitor/visitorpage/assets/vendor/fonts/boxicons`.
- Prisoner template fonts under `prisoner/assets/fonts`.

Uploaded media:

- `uploads/prisoners/`
- `uploads/review/`
- `uploads/visitors/`
- `officer/uploads/`
- `visitor/profilepics/`
- `visitor/visitorpage/html/profilepics/`

## 3. Old PHP/Frontend Pages Found

Important pages:

| File path | Role | Page purpose | Mostly UI or backend PHP logic? | Recommended Next.js route |
| --- | --- | --- | --- | --- |
| `index.php` | public | Landing page with hero, about, services/contact/newsletter sections | Mostly UI, includes PHP header/footer and PHP form targets | `/` |
| `visitor/login.php` | visitor/public | Visitor login form | Mixed UI and backend PHP session/MySQL login logic | `/login/visitor` or `/auth/visitor/login` |
| `visitor/register.php` | visitor/public | Visitor registration form | Mixed UI and backend PHP MySQL insert/validation | `/register/visitor` |
| `admin/adminlogin.php` | admin/public | Admin login form | Heavy backend PHP login/session/password logic | `/login/admin` or unified `/login` |
| `officer/officerlogin.php` | officer/public | Officer login form | Mixed UI and backend PHP login/session logic | `/login/officer` or unified `/login` |
| `prisoner/prisonerlogin.php` | prisoner/public | Prisoner login using prisoner ID/incarceration date | Mixed UI and backend PHP lookup/session logic | `/login/prisoner` |
| `admin/adindex.php` | admin | Admin dashboard | Mixed UI/session; dashboard cards and links | `/admin/dashboard` |
| `officer/index.php` | officer | Officer dashboard counts | Heavy backend PHP count queries + UI | `/officer/dashboard` |
| `visitor/visitorpage/html/vhome.php` | visitor | Visitor dashboard/home | Mixed UI/session/MySQL fetch | `/visitor/dashboard` |
| `prisoner/index.php` | prisoner | Prisoner dashboard/profile overview | Heavy backend PHP query logic + UI | `/prisoner/dashboard` |
| `visitor/visitorpage/html/booking.php` | visitor | Book appointment with prisoner | Heavy backend PHP form/query logic + UI | `/visitor/bookings/new` |
| `visitor/visitorpage/html/status.php` | visitor | Appointment/status tracking | Heavy backend PHP query logic + UI | `/visitor/appointments/status` |
| `visitor/visitorpage/html/prisoners.php` | visitor | Browse prisoner records | Heavy backend PHP queries/assets | `/visitor/prisoners` |
| `visitor/visitorpage/html/profile.php` | visitor | Visitor profile | Mixed UI/session/MySQL | `/visitor/profile` |
| `visitor/visitorpage/html/accountsettings.php` | visitor | Account settings/profile edits | Mixed UI/backend logic | `/visitor/settings` |
| `officer/newappointment.php` | officer | Pending appointment review | Heavy backend PHP query/action logic | `/officer/appointments/pending` |
| `officer/accepted.php` | officer | Accepted appointments | Heavy backend PHP action/query logic | `/officer/appointments/accepted` |
| `officer/rejected.php` | officer | Rejected appointments and replies | Heavy backend PHP action/query logic | `/officer/appointments/rejected` |
| `officer/prisoners.php` | officer | Prisoner listing/management | Heavy backend PHP logic and upload path logic | `/officer/prisoners` |
| `officer/add_prisoner.php` | officer | Add prisoner | Heavy backend PHP insert/upload logic | `/officer/prisoners/new` |
| `officer/update_prisoner.php` | officer | Update prisoner action | Backend PHP action endpoint | API route/backend only, not a page |
| `officer/delete_prisoner.php` | officer | Delete prisoner action | Backend PHP action endpoint | API route/backend only, not a page |
| `officer/fir.php` | officer | FIR record handling | Mixed UI/backend logic | `/officer/fir` |
| `officer/requests.php` | officer | Create/request parole for prisoner | Heavy backend PHP action/query logic | `/officer/parole/requests` |
| `officer/pendingparole.php` | officer | Pending parole approvals | Heavy backend PHP query/action logic | `/officer/parole/pending` |
| `officer/acceptedparole.php` | officer | Accepted parole list | Heavy backend PHP query/action logic | `/officer/parole/accepted` |
| `officer/rejectedparole.php` | officer | Rejected parole list | Heavy backend PHP query/action logic | `/officer/parole/rejected` |
| `officer/accept_parole.php` | officer | Accept parole action | Backend PHP action endpoint | API route/backend only |
| `officer/reject_parole.php` | officer | Reject parole action | Backend PHP action endpoint | API route/backend only |
| `prisoner/parole.php` | prisoner | Prisoner parole request/status UI | Mixed UI/backend logic | `/prisoner/parole` |
| `prisoner/parolestatus.php` | prisoner | Prisoner parole status | Mixed UI/backend logic | `/prisoner/parole/status` |
| `prisoner/visitorhistory.php` | prisoner | Visitor history | Mixed UI/backend logic | `/prisoner/visitors/history` |
| `admin/userdetails.php` | admin | Visitor/user management | Heavy backend PHP query/UI | `/admin/users` |
| `admin/officersdetails.php` | admin | Officer management | Heavy backend PHP query/UI | `/admin/officers` |
| `admin/prisonerdetails.php` | admin | Prisoner details/management | Heavy backend PHP and upload path logic | `/admin/prisoners` |
| `admin/appointments.php` | admin | Appointment list | Mixed UI/backend logic | `/admin/appointments` |
| `admin/appointmentdetails.php` | admin | Appointment details | Mixed UI/backend logic | `/admin/appointments/[id]` |
| `admin/adminprofile.php` | admin | Admin profile | Mixed UI/session logic | `/admin/profile` |

Template/demo pages such as `starter-page.html`, `service-details.html`, `portfolio-details.html`, `officer/*.html`, `visitor/visitorpage/html/ui-*.html`, `admin/components/*.html`, and `prisoner/*.html` are mostly static UI references or vendor template samples.

## 4. Active Next.js Readiness Check

| Item | Exists at frontend root? | Notes |
| --- | --- | --- |
| `package.json` | No | Only legacy template package files found at `officer/package.json` and `visitor/visitorpage/package.json`. |
| `app/` or `pages/` | No | No active Next.js routing folder exists. |
| `public/` | Yes | Contains `public/legacy`, not a curated active asset structure yet. |
| `next.config.js` or `next.config.ts` | No | No Next config found. |
| `tsconfig.json` | No | No TypeScript config found. |
| `tailwind.config.js/ts` | No | No Tailwind config found. |
| `src/` | No at root | `officer/src` exists, but it is old template source assets, not active Next app code. |
| `components/` | No at root | `admin/components` exists, but it is old template/demo HTML. |
| `lib/` | No | No shared Next.js library folder found. |
| `.env.local` or `.env.local.example` | No | No frontend environment file found. |

Conclusion: the frontend folder is not currently a runnable Next.js app. It is a legacy asset/source dump plus a `public/legacy` copied asset area.

## 5. Mess/Conflict Report

Possible problems caused by copying old files:

| Issue | Evidence | Risk |
| --- | --- | --- |
| PHP files inside frontend folder | 79 `.php` files across root/admin/officer/visitor/prisoner | Next.js cannot execute PHP; these are migration references only. |
| Old database files | `jailmeet.sql`, `admin/db.php`, `officer/db.php`, `visitor/db.php`, `prisoner/db.php`, `visitor/visitorpage/html/db.php` | Conflicts with new PostgreSQL/Prisma backend architecture. |
| Old include files | `includes/header.php`, `includes/footer.php`, role-specific navbar/sidebar includes | Need to become React layouts/components. |
| Old vendor folders | Multiple Bootstrap/jQuery/template vendors duplicated across role folders | Large bundle risk and path conflicts if imported directly. |
| Old package files | `officer/package.json`, `visitor/visitorpage/package.json` | These are template build configs, not Next.js app configs. Do not use as root package config. |
| Hardcoded old app paths | `/Project/JailMeet/...` in login redirects, upload paths, and visitor dashboard files | Will break in Next.js and Windows/production hosting. |
| Old form action paths | `forms/contact.php`, `forms/newsletter.php`, `officerlogin.php`, `update_admin.php`, PHP self-posts | Must be replaced with frontend fetch calls to backend APIs. |
| Old script/link paths | `assets/...`, `../assets/...`, `assets1/...`, role-local paths | Need stable public asset mapping. |
| Old `mysqli`/session code in UI pages | Found in login, dashboards, booking, parole, prisoner/admin/officer pages | Must move to backend APIs and JWT-based frontend auth. |
| Plaintext legacy password checks | Visitor/officer login compare plain strings in old PHP | Do not port this behavior; new backend uses bcrypt/JWT. |
| Duplicate assets | `assets`, `admin/assets`, `officer/assets`, `visitor/assets`, `public/legacy/...` | Can confuse import paths and inflate repo size. |
| Mac/system files | Many `.DS_Store` files | Ignore now; delete later after backup. |

Examples of hardcoded legacy paths:

- `visitor/login.php` redirects to `/Project/JailMeet/visitor/visitorpage/html/vhome.php`.
- `visitor/visitorpage/html/vhome.php` redirects to `/Project/JailMeet/visitor/login.php`.
- `admin/prisonerdetails.php` and `officer/prisoners.php` reference `/Project/JailMeet/officer/uploads/`.
- `visitor/visitorpage/html/prisoners.php` references an absolute XAMPP path.

## 6. Asset Path Report

Suggested Next.js public path mapping:

| Old pattern | Current use | Suggested new public path |
| --- | --- | --- |
| `assets/...` | Landing page CSS/JS/images/vendor | `/legacy/landing/assets/...` |
| `../assets/...` from visitor dashboard pages | Sneat visitor dashboard assets | `/legacy/visitor/visitorpage/assets/...` |
| `/Project/JailMeet/...` | Old XAMPP-root redirects/uploads/images | Replace with Next.js routes for navigation; map media to `/legacy/...` only where needed |
| `uploads/...` | Uploaded legacy prisoner/review/visitor media | `/legacy/uploads/...` |
| `profilepics/...` | Visitor profile pictures | `/legacy/visitor/profilepics/...` |
| `officer/uploads/...` | Prisoner profile uploads from officer workflow | `/legacy/uploads/prisoners/...` or `/legacy/officer/uploads/...` during transition |
| `visitor/visitorpage/assets/...` | Visitor dashboard template assets | `/legacy/visitor/visitorpage/assets/...` |
| `admin/assets/...` | Admin public/landing-like assets | `/legacy/admin/assets/...` |
| `admin/assets1/...` | Admin dashboard template assets | `/legacy/admin/assets1/...` |
| `officer/assets/...` | Officer public/template assets | `/legacy/officer/assets/...` |
| `officer/src/...` | Officer Deskapp source/template assets | `/legacy/officer/src/...` if used directly |
| `officer/vendors/...` | Officer vendor template assets | `/legacy/officer/vendors/...` |
| `prisoner/assets/...` | Prisoner dashboard assets | `/legacy/prisoner/assets/...` |
| `prisoner/assets1/...` | Prisoner alternate/landing assets | `/legacy/prisoner/assets1/...` |
| Root `prison1.jpg`, `jailmeet_video.mp4`, logos | Landing hero/media | `/legacy/landing/prison1.jpg`, `/legacy/landing/jailmeet_video.mp4`, etc. |

Important: `public/legacy` already exists, so the project may have started this mapping. Before coding pages, verify whether each needed file already exists under `public/legacy` and use that path when possible.

## 7. Page Migration Map

| Old file path | Page purpose | New Next.js route | Required assets | Required backend API | Priority |
| --- | --- | --- | --- | --- | --- |
| `index.php` | Landing page | `/` | Root landing images/video, `assets/css/main.css`, Bootstrap Icons, AOS, Glightbox, Swiper | Optional health/contact later | High |
| `visitor/login.php` | Visitor login | `/login/visitor` or unified `/login` | Landing assets, `prison1.jpg` | `POST /api/auth/login` | High |
| `visitor/register.php` | Visitor register | `/register/visitor` | Landing assets, Bootstrap styles | `POST /api/auth/register-visitor` | High |
| `admin/adminlogin.php` | Admin login | `/login/admin` or unified `/login` | Landing/admin login assets | `POST /api/auth/login` | High |
| `officer/officerlogin.php` | Officer login | `/login/officer` or unified `/login` | Landing/officer login assets | `POST /api/auth/login` | High |
| `prisoner/prisonerlogin.php` | Prisoner login | `/login/prisoner` | Prisoner/landing login assets | `POST /api/auth/login` or future prisoner-specific login if required | High |
| `admin/adindex.php` | Admin dashboard | `/admin/dashboard` | `admin/assets1/...` Kaiadmin assets | `GET /api/dashboard/admin`, `GET /api/auth/me` | High |
| `officer/index.php` | Officer dashboard | `/officer/dashboard` | `officer/src`, `officer/vendors`, dashboard CSS/JS | `GET /api/dashboard/officer`, `GET /api/auth/me` | High |
| `visitor/visitorpage/html/vhome.php` | Visitor dashboard | `/visitor/dashboard` | `visitor/visitorpage/assets/...` Sneat assets | `GET /api/dashboard/visitor`, `GET /api/auth/me` | High |
| `prisoner/index.php` | Prisoner dashboard/profile | `/prisoner/dashboard` | `prisoner/assets/...` | `GET /api/dashboard/prisoner`, `GET /api/auth/me` | High |
| `visitor/visitorpage/html/booking.php` | Visitor booking page | `/visitor/bookings/new` | Visitor dashboard assets | Future appointment create/list APIs | Medium |
| `visitor/visitorpage/html/status.php` | Visitor appointment status | `/visitor/appointments/status` | Visitor dashboard assets | Future appointment status API | Medium |
| `officer/newappointment.php` | Officer appointment approval page | `/officer/appointments/pending` | Officer dashboard/table assets | Future appointment approval/list APIs | Medium |
| `prisoner/parole.php` | Prisoner parole page | `/prisoner/parole` | Prisoner dashboard assets | Future parole request/status APIs | Medium |
| `officer/pendingparole.php` | Officer parole approval page | `/officer/parole/pending` | Officer table/dashboard assets | Future parole approval/list APIs | Medium |
| `officer/prisoners.php` | Prisoner management list | `/officer/prisoners` | Officer dashboard/table assets, upload images | Future prisoner CRUD/list APIs | Medium |
| `officer/add_prisoner.php` | Add prisoner form | `/officer/prisoners/new` | Officer form assets | Future prisoner create API | Medium |
| `admin/userdetails.php` | Admin user/visitor management | `/admin/users` | Admin table assets | Future admin user list/manage APIs | Medium |
| `admin/officersdetails.php` | Admin officer management | `/admin/officers` | Admin table/form assets | Future officer CRUD APIs | Medium |
| `admin/prisonerdetails.php` | Admin prisoner management | `/admin/prisoners` | Admin table assets, prisoner uploads | Future prisoner list/admin APIs | Medium |
| `officer/fir.php` | FIR records | `/officer/fir` | Officer assets | Future FIR APIs | Low |
| `prisoner/visitorhistory.php` | Prisoner visitor history | `/prisoner/visitors/history` | Prisoner assets | Future visitor history API | Low |

## 8. Recommended Cleanup Strategy

Do not perform cleanup now. Recommended categories:

Keep as active Next.js code:

- Future root `app/`, `components/`, `lib/`, `styles/`, `public/`.
- New TypeScript/React pages created during migration.
- API client helpers for backend calls.

Keep as legacy reference:

- All old `.php` files until each corresponding route is migrated.
- `admin/includes`, `officer/navbar.php`, `officer/sidebar.php`, `visitor/visitorpage/html/navbar.php`, `visitor/visitorpage/html/sidebar.php`, `prisoner/navbar.php`, `prisoner/sidebar.php`.
- Template demo pages until equivalent layouts/components are identified.

Keep as public assets:

- Required landing media and logos.
- Role dashboard CSS/JS/fonts/images needed to preserve visual appearance.
- Uploaded media needed for demo/testing.
- Prefer curated paths under `public/legacy/...`.

Ignore later:

- Template documentation folders.
- Demo-only pages such as UI component examples, maps, charts, blank pages, error pages, unless a specific UI element is needed.
- Source maps if not needed.

Delete later only after backup:

- `.DS_Store`.
- Duplicate vendor/template folders after routes are migrated and verified.
- Old PHP DB connection files and PHP action endpoints.
- `jailmeet.sql`, once the Prisma/PostgreSQL migration is accepted as source of truth.
- Old template `package.json` and build tooling if not used.

## 9. Recommended Migration Order

1. Create a real Next.js + TypeScript scaffold at the frontend root without deleting legacy files.
2. Copy or map only the required landing assets into `public/legacy/landing/...`.
3. Convert `index.php` landing page first into `app/page.tsx`, preserving current UI/UX and using public asset paths.
4. Convert login/register pages next and connect them to the existing backend auth APIs.
5. Build shared auth token storage and role-aware route guards.
6. Convert role dashboards: admin, officer, visitor, prisoner.
7. Convert visitor booking workflow.
8. Convert visitor status workflow.
9. Convert prisoner management screens.
10. Convert parole workflow for prisoner/officer.
11. Convert FIR and medical record screens.
12. Normalize uploads/media handling and replace legacy upload paths with backend-managed media APIs.

## 10. First Safe Coding Step

Recommended first coding step after this analysis:

Set up a real Next.js + TypeScript frontend scaffold at `frontend`, then convert the old `frontend/index.php` landing page into `frontend/app/page.tsx` while preserving the existing layout, text, imagery, Bootstrap-based styling, and media behavior as closely as possible.

Do not start with dashboards or authenticated flows. The landing page has the lowest backend dependency and will establish the asset-path strategy safely.
