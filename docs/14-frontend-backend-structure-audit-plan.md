# JailMeet 2.0 Frontend/Backend Structure Audit Plan

## 1. Current Structure Summary

Project root:

- `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0`

Frontend root:

- `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\frontend`

Backend root:

- `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\backend`

Active frontend application folders:

- `frontend/app` - active Next.js App Router pages and route layouts.
- `frontend/components` - active React components, currently split into `auth` and `legacy` role shells.
- `frontend/src/lib` - active frontend API/auth helpers.
- `frontend/src/types` - active shared frontend TypeScript types.
- `frontend/public/legacy` - public runtime assets copied from the old PHP frontend.

Legacy/reference frontend folders still present:

- `frontend/admin` - old PHP admin area.
- `frontend/officer` - old PHP officer area.
- `frontend/prisoner` - old PHP prisoner area.
- `frontend/visitor` - old PHP visitor area.
- `frontend/forms` - old PHP form handlers.
- `frontend/includes` - old PHP landing includes.
- `frontend/uploads` - old uploaded media/source uploads.
- `frontend/assets` - old landing/template assets outside the Next.js public tree.
- `frontend/legacy-reference` - selected old PHP files already moved out of public for reference.

Frontend generated/dependency folders:

- `frontend/.next` - generated Next.js build output.
- `frontend/node_modules` - frontend dependencies.

Backend active folders:

- `backend/src` - active Express/TypeScript source.
- `backend/prisma` - Prisma schema, migrations, and seed.
- `backend/scripts` - backend API verification scripts.
- `backend/node_modules` - backend dependencies.

## 2. Problems Found

Mixed legacy and active frontend source:

- Active Next.js code lives beside old PHP folders in the same `frontend` root.
- Old PHP source folders still exist at `frontend/admin`, `frontend/officer`, `frontend/prisoner`, `frontend/visitor`, `frontend/forms`, and `frontend/includes`.
- This is acceptable during migration, but it makes accidental public exposure or mistaken edits more likely.

Component location inconsistency:

- Active shared helpers use `frontend/src`.
- Active React components are outside `src` at `frontend/components`.
- This works, but a professional final structure should choose one convention. Recommended final convention: move active components into `frontend/src/components` later.

Legacy assets are broad and mixed:

- `frontend/public/legacy/admin` contains both `assets` and `assets1`.
- `frontend/public/legacy/officer` contains `assets`, `src`, `vendors`, and an empty `includes` folder.
- `frontend/public/legacy/prisoner` contains `assets` and `assets1`; `assets1` appears to be unrelated Dewi/landing assets.
- `frontend/public/legacy/visitor/visitorpage` contains Sneat/Boxicons template assets plus many HTML reference files.

CSS loading issue:

- Landing CSS is loaded globally in `frontend/app/layout.tsx`, so landing Bootstrap/Dewi CSS affects every route.
- Role-specific CSS is scoped in role layouts/components, which is good.
- The global landing CSS should eventually move to a landing-only wrapper or a route-specific strategy to reduce cross-route style collisions.

Backend module gap:

- Backend has working `auth` and `dashboard` modules.
- Prisma schema already defines data for appointments, parole requests, prisoners, FIR records, medical records, notifications, and audit logs, but matching CRUD/workflow API modules do not exist yet.

Public uploaded media risk:

- `frontend/public/legacy/uploads` contains uploaded prisoner/review/visitor media.
- This may be needed as legacy reference, but it should be reviewed before production because anything under `public` is browser-accessible.

## 3. Active Next.js Pages List

Active root/landing/auth pages:

- `frontend/app/layout.tsx` - global root layout and globally loaded landing CSS.
- `frontend/app/globals.css` - Tailwind/global base CSS.
- `frontend/app/page.tsx` - active landing page migrated from old `index.php`.
- `frontend/app/login/page.tsx` - active login page using `components/auth/LoginForm.tsx`.

Active admin pages:

- `frontend/app/admin/layout.tsx` - admin route layout.
- `frontend/app/admin/page.tsx` - redirects `/admin` to `/admin/dashboard`.
- `frontend/app/admin/dashboard/page.tsx` - active admin dashboard page.

Active visitor pages:

- `frontend/app/visitor/layout.tsx` - visitor route layout.
- `frontend/app/visitor/page.tsx` - redirects `/visitor` to `/visitor/dashboard`.
- `frontend/app/visitor/dashboard/page.tsx` - active visitor dashboard page.

Active officer pages:

- `frontend/app/officer/layout.tsx` - officer route layout.
- `frontend/app/officer/page.tsx` - redirects `/officer` to `/officer/dashboard`.
- `frontend/app/officer/dashboard/page.tsx` - active officer dashboard page.

Active prisoner pages:

- `frontend/app/prisoner/layout.tsx` - prisoner route layout.
- `frontend/app/prisoner/page.tsx` - redirects `/prisoner` to `/prisoner/dashboard`.
- `frontend/app/prisoner/dashboard/page.tsx` - active prisoner dashboard page.

## 4. Legacy Reference Files List

Explicit legacy-reference folder:

- `frontend/legacy-reference/officer/includes/header.php`
- `frontend/legacy-reference/officer/includes/footer.php`
- `frontend/legacy-reference/visitor/visitorpage/html/accountsettings.php`
- `frontend/legacy-reference/visitor/visitorpage/html/booking.php`
- `frontend/legacy-reference/visitor/visitorpage/html/db.php`
- `frontend/legacy-reference/visitor/visitorpage/html/home.php`
- `frontend/legacy-reference/visitor/visitorpage/html/navbar.php`
- `frontend/legacy-reference/visitor/visitorpage/html/prisoners.php`
- `frontend/legacy-reference/visitor/visitorpage/html/profile.php`
- `frontend/legacy-reference/visitor/visitorpage/html/sidebar.php`
- `frontend/legacy-reference/visitor/visitorpage/html/status.php`
- `frontend/legacy-reference/visitor/visitorpage/html/vhome.php`

Old PHP folders that should be treated as legacy reference until converted:

- `frontend/admin/*.php`
- `frontend/admin/includes/*.php`
- `frontend/officer/*.php`
- `frontend/officer/includes/*.php`
- `frontend/prisoner/*.php`
- `frontend/prisoner/includes/*.php`
- `frontend/visitor/*.php`
- `frontend/visitor/includes/*.php`
- `frontend/forms/*.php`
- `frontend/includes/*.php`
- `frontend/index.php`

Important legacy data/source file:

- `frontend/jailmeet.sql` - old MySQL database reference only; must never be copied into `public`.

## 5. Public Asset Safety Status

Current public legacy roots:

- `frontend/public/legacy/admin`
- `frontend/public/legacy/landing`
- `frontend/public/legacy/logos`
- `frontend/public/legacy/officer`
- `frontend/public/legacy/prisoner`
- `frontend/public/legacy/uploads`
- `frontend/public/legacy/videos`
- `frontend/public/legacy/visitor`

Unsafe public-file scan result:

- No `.php`, `.env`, `.sql`, `db.php`, `package.json`, `package-lock.json`, `yarn.lock`, `gulpfile.js`, or `webpack.config.js` files were found under `frontend/public`.

Public folders needing review:

- `frontend/public/legacy/uploads/prisoners` - public uploaded prisoner images.
- `frontend/public/legacy/uploads/review` - public review images.
- `frontend/public/legacy/uploads/visitors` - public visitor images.
- `frontend/public/legacy/visitor/visitorpage/html` - contains many old `.html` template reference files; safe compared with PHP but not necessarily needed at runtime.
- `frontend/public/legacy/admin/assets/scss/Readme.txt` and similar template documentation files should be cleaned later only after confirming they are unreferenced.
- `frontend/public/legacy/admin/assets1/.DS_Store` and similar `.DS_Store` files should be removed later.
- `frontend/public/legacy/admin/desktop.ini` should be removed later if unreferenced.

Files that should never be in public:

- Any `.php` file.
- Any `.env` file.
- Any `.sql` file, including `frontend/jailmeet.sql`.
- Any `db.php`.
- Any credential-bearing config.
- Any `node_modules`.
- Any `.git` or `.github`.
- Any package/build tooling such as `package.json`, `package-lock.json`, `gulpfile.js`, or webpack configs.

## 6. CSS Loading Analysis

Global CSS:

- `frontend/app/layout.tsx` imports `frontend/app/globals.css`.
- `frontend/app/globals.css` loads Tailwind base/components/utilities and minimal global resets.

Global legacy CSS currently loaded in `frontend/app/layout.tsx`:

- `/legacy/landing/assets/vendor/bootstrap/css/bootstrap.min.css`
- `/legacy/landing/assets/vendor/bootstrap-icons/bootstrap-icons.css`
- `/legacy/landing/assets/vendor/aos/aos.css`
- `/legacy/landing/assets/vendor/glightbox/css/glightbox.min.css`
- `/legacy/landing/assets/vendor/swiper/swiper-bundle.min.css`
- `/legacy/landing/assets/css/main.css`

Role-specific CSS:

- Admin CSS is loaded in `frontend/components/legacy/admin/AdminLayout.tsx`:
  - `/legacy/admin/assets1/css/bootstrap.min.css`
  - `/legacy/admin/assets1/css/plugins.min.css`
  - `/legacy/admin/assets1/css/kaiadmin.min.css`
  - `/legacy/admin/assets1/css/fonts.min.css`
  - `/legacy/admin/assets1/css/demo.css`
- Visitor CSS is loaded in `frontend/app/visitor/layout.tsx`:
  - `/legacy/visitor/visitorpage/assets/vendor/fonts/boxicons.css`
  - `/legacy/visitor/visitorpage/assets/vendor/css/core.css`
  - `/legacy/visitor/visitorpage/assets/vendor/css/theme-default.css`
  - `/legacy/visitor/visitorpage/assets/css/demo.css`
  - `/legacy/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css`
- Officer CSS is loaded in `frontend/app/officer/layout.tsx`:
  - `/legacy/officer/vendors/styles/core.css`
  - `/legacy/officer/vendors/styles/icon-font.min.css`
  - `/legacy/officer/vendors/styles/style.css`
- Prisoner CSS is loaded in `frontend/app/prisoner/layout.tsx`:
  - `/legacy/prisoner/assets/plugins/simplebar/css/simplebar.css`
  - `/legacy/prisoner/assets/css/bootstrap.min.css`
  - `/legacy/prisoner/assets/css/animate.css`
  - `/legacy/prisoner/assets/css/icons.css`
  - `/legacy/prisoner/assets/css/sidebar-menu.css`
  - `/legacy/prisoner/assets/css/app-style.css`

Recommendation:

- Keep role CSS scoped to role route layouts.
- Move landing CSS out of the global root layout in a later safe step, because it currently affects `/login`, `/admin`, `/visitor`, `/officer`, and `/prisoner`.
- Keep `frontend/app/globals.css` for Tailwind and minimal reset only.

## 7. Recommended Frontend Structure

Recommended final active structure:

```text
frontend/
  app/
    page.tsx
    layout.tsx
    globals.css
    login/page.tsx
    register/visitor/page.tsx
    admin/
      layout.tsx
      dashboard/page.tsx
      visitors/page.tsx
      officers/page.tsx
      prisoners/page.tsx
      appointments/page.tsx
    visitor/
      layout.tsx
      dashboard/page.tsx
      prisoners/page.tsx
      booking/page.tsx
      status/page.tsx
      settings/page.tsx
    officer/
      layout.tsx
      dashboard/page.tsx
      appointments/page.tsx
      appointments/new/page.tsx
      appointments/accepted/page.tsx
      appointments/rejected/page.tsx
      prisoners/page.tsx
      fir/page.tsx
      parole/requests/page.tsx
      parole/pending/page.tsx
      parole/accepted/page.tsx
      parole/rejected/page.tsx
    prisoner/
      layout.tsx
      dashboard/page.tsx
      parole/request/page.tsx
      parole/status/page.tsx
      visits/history/page.tsx
  src/
    components/
      auth/
      legacy/
      ui/
    hooks/
    lib/
    services/
    types/
  public/
    legacy/
  legacy-reference/
```

Components that should move later:

- Move `frontend/components/auth/LoginForm.tsx` to `frontend/src/components/auth/LoginForm.tsx`.
- Move `frontend/components/legacy/admin/*` to `frontend/src/components/legacy/admin/*`.
- Move `frontend/components/legacy/visitor/*` to `frontend/src/components/legacy/visitor/*`.
- Move `frontend/components/legacy/officer/*` to `frontend/src/components/legacy/officer/*`.
- Move `frontend/components/legacy/prisoner/*` to `frontend/src/components/legacy/prisoner/*`.

Do not move yet without a dedicated refactor because imports currently depend on the existing structure.

## 8. Recommended Backend Structure

Current backend modules:

- `backend/src/modules/auth`
- `backend/src/modules/dashboard`
- `backend/src/modules/users` - placeholder/index only.

Current backend support folders:

- `backend/src/config`
- `backend/src/middlewares`
- `backend/src/utils`
- `backend/scripts`
- `backend/prisma`

Recommended final backend structure:

```text
backend/src/
  app.ts
  server.ts
  config/
  middlewares/
  utils/
  modules/
    auth/
    dashboard/
    users/
    profiles/
    visitors/
    officers/
    prisoners/
    appointments/
    parole/
    fir/
    medical/
    notifications/
    audit/
    uploads/
```

Missing backend modules based on Prisma schema and migrated UI:

- `backend/src/modules/users` full implementation.
- `backend/src/modules/profiles` or role-specific profile modules.
- `backend/src/modules/visitors`
- `backend/src/modules/officers`
- `backend/src/modules/prisoners`
- `backend/src/modules/appointments`
- `backend/src/modules/parole`
- `backend/src/modules/fir`
- `backend/src/modules/medical`
- `backend/src/modules/notifications`
- `backend/src/modules/audit`
- `backend/src/modules/uploads`

Recommended module file pattern:

- `<module>.routes.ts`
- `<module>.controller.ts`
- `<module>.service.ts`
- `<module>.validation.ts`
- `index.ts`

## 9. Page-To-Component Mapping

Current active mappings:

| Route | Page file | Layout/component files |
| --- | --- | --- |
| `/` | `frontend/app/page.tsx` | Landing JSX in page; legacy landing assets from `/legacy/landing` |
| `/login` | `frontend/app/login/page.tsx` | `frontend/components/auth/LoginForm.tsx` |
| `/admin` | `frontend/app/admin/page.tsx` | Redirect to `/admin/dashboard` |
| `/admin/dashboard` | `frontend/app/admin/dashboard/page.tsx` | `frontend/components/legacy/admin/AdminLayout.tsx`, `AdminNavbar.tsx`, `AdminSidebar.tsx`, `AdminFooter.tsx` |
| `/visitor` | `frontend/app/visitor/page.tsx` | Redirect to `/visitor/dashboard` |
| `/visitor/dashboard` | `frontend/app/visitor/dashboard/page.tsx` | `frontend/components/legacy/visitor/VisitorLayout.tsx`, `VisitorNavbar.tsx`, `VisitorSidebar.tsx`, `VisitorFooter.tsx` |
| `/officer` | `frontend/app/officer/page.tsx` | Redirect to `/officer/dashboard` |
| `/officer/dashboard` | `frontend/app/officer/dashboard/page.tsx` | `frontend/components/legacy/officer/OfficerLayout.tsx`, `OfficerNavbar.tsx`, `OfficerSidebar.tsx`, `OfficerFooter.tsx` |
| `/prisoner` | `frontend/app/prisoner/page.tsx` | Redirect to `/prisoner/dashboard` |
| `/prisoner/dashboard` | `frontend/app/prisoner/dashboard/page.tsx` | `frontend/components/legacy/prisoner/PrisonerLayout.tsx`, `PrisonerNavbar.tsx`, `PrisonerSidebar.tsx`, `PrisonerFooter.tsx` |

Missing frontend pages:

- `/register/visitor` or `/visitor/register`
- `/admin/visitors`
- `/admin/officers`
- `/admin/admins`
- `/admin/prisoners`
- `/admin/appointments`
- `/visitor/prisoners`
- `/visitor/booking`
- `/visitor/status`
- `/visitor/settings`
- `/officer/appointments`
- `/officer/appointments/new`
- `/officer/appointments/accepted`
- `/officer/appointments/rejected`
- `/officer/prisoners`
- `/officer/fir`
- `/officer/parole/requests`
- `/officer/parole/pending`
- `/officer/parole/accepted`
- `/officer/parole/rejected`
- `/officer/profile`
- `/officer/profile/settings`
- `/prisoner/parole/request`
- `/prisoner/parole/status`
- `/prisoner/visits/history`

## 10. Service/Type/Hook Recommendations

Current frontend helpers:

- `frontend/src/lib/api.ts`
- `frontend/src/lib/auth.ts`
- `frontend/src/types/auth.ts`

Recommended frontend services:

- `frontend/src/services/auth.service.ts`
- `frontend/src/services/dashboard.service.ts`
- `frontend/src/services/visitor.service.ts`
- `frontend/src/services/appointment.service.ts`
- `frontend/src/services/prisoner.service.ts`
- `frontend/src/services/parole.service.ts`
- `frontend/src/services/officer.service.ts`
- `frontend/src/services/admin.service.ts`

Recommended frontend hooks:

- `frontend/src/hooks/useAuth.ts`
- `frontend/src/hooks/useProtectedRoute.ts`
- `frontend/src/hooks/useDashboard.ts`
- `frontend/src/hooks/useRoleRedirect.ts`
- `frontend/src/hooks/useApiError.ts`

Recommended frontend types:

- `frontend/src/types/auth.ts` - already exists.
- `frontend/src/types/dashboard.ts`
- `frontend/src/types/user.ts`
- `frontend/src/types/profile.ts`
- `frontend/src/types/appointment.ts`
- `frontend/src/types/parole.ts`
- `frontend/src/types/prisoner.ts`
- `frontend/src/types/api.ts`

Immediate benefit:

- Dashboards currently duplicate `fetchWithAuth`, `readJson`, loading/401/403/error handling. A shared dashboard/auth hook would reduce duplication and prevent future role-dashboard drift.

## 11. Cleanup Tasks

Safe documentation-only cleanup plan:

- Move remaining old PHP role folders into `frontend/legacy-reference` after confirming all needed assets are already in `frontend/public/legacy`.
- Keep original old folders until each page/workflow is migrated or archived.
- Remove unreferenced `.DS_Store`, `desktop.ini`, and `Readme.txt` files from `frontend/public/legacy` after checking references.
- Review `frontend/public/legacy/uploads` before production; decide whether legacy uploads should stay public, move to private storage, or be served through backend authorization.
- Remove empty `frontend/public/legacy/officer/includes` later if confirmed unused.
- Review `frontend/public/legacy/visitor/visitorpage/html/*.html` template examples; keep only files actually needed as visual assets or move to `legacy-reference`.
- Move active components under `frontend/src/components` in a dedicated import-refactor task.
- Create `frontend/src/services`, `frontend/src/hooks`, and expanded `frontend/src/types`.
- Keep `frontend/app` focused on route composition, layouts, and page entry points.
- Do not delete `frontend/jailmeet.sql` until a backup/archive plan exists; never move it into public.

Backend cleanup/structure tasks:

- Complete or remove placeholder `backend/src/modules/users/index.ts`.
- Add missing modules in workflow order: appointments, prisoners, parole, FIR, medical.
- Add `uploads` only after deciding storage strategy.
- Add `notifications` and `audit` after core CRUD/workflow modules.
- Standardize response and error helpers across modules using `backend/src/utils/apiResponse.ts` and `backend/src/middlewares/errorHandler.ts`.

## 12. Safe Next Coding Step

The safest next coding step is to create a shared frontend API/dashboard service layer without changing UI behavior:

- Add `frontend/src/types/dashboard.ts` for admin, visitor, officer, and prisoner dashboard response shapes.
- Add `frontend/src/services/dashboard.service.ts` with typed `getAdminDashboard`, `getVisitorDashboard`, `getOfficerDashboard`, and `getPrisonerDashboard` functions.
- Add `frontend/src/services/auth.service.ts` or extend `frontend/src/lib/auth.ts` carefully for `getMe`.
- Refactor one dashboard first, preferably `frontend/app/visitor/dashboard/page.tsx`, to use the new service while preserving identical UI and behavior.

Why this is safest:

- It does not touch legacy assets.
- It does not alter backend behavior.
- It reduces duplicated fetch/token/error logic before adding more pages.
- It creates the foundation needed for upcoming booking, appointment, parole, prisoner, and profile pages.
