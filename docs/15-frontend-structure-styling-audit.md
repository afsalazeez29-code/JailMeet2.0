# JailMeet 2.0 Frontend Structure & Styling Audit

Date: 2026-07-17
Scope: Read-only frontend audit for `C:\Users\afsal\OneDrive\Desktop\JailMeet2.0\frontend`.

## Checkpoint Summary

- Overall state: Working but still legacy-heavy. The app has a functional Next.js App Router structure with role-specific layouts, while old copied PHP/template assets remain available as migration reference.
- Critical findings: None found. I did not identify a current styling leak, missing required `"use client"`, duplicate role stylesheet load, or unsafe DOM manipulation that is actively breaking pages.
- Biggest risk: The main future risk is technical debt from large mixed pages and globally available legacy asset folders, not an immediate production-breaking issue.
- Part 2 status: No critical fixes are recommended before review. Moderate and low-priority cleanup should be handled later using the touched-for-a-reason approach.

## 1. Route List And Page Purpose

### Public / Shared Auth

| File | Route | Purpose |
| --- | --- | --- |
| `frontend/app/page.tsx` | `/` | Legacy landing page migrated into a React client component with landing assets and legacy script initialization. |
| `frontend/app/login/page.tsx` | `/login` | Shared login route rendering `LoginForm`. |
| `frontend/app/register/page.tsx` | `/register` | Public visitor registration route rendering `VisitorRegisterForm`. |

### Admin

| File | Route | Purpose |
| --- | --- | --- |
| `frontend/app/admin/page.tsx` | `/admin` | Redirect/entry wrapper for admin area. |
| `frontend/app/admin/dashboard/page.tsx` | `/admin/dashboard` | Admin dashboard summary cards and quick links. |
| `frontend/app/admin/users/page.tsx` | `/admin/users` | Admin user list with search, filters, pagination, details, and status modal. |
| `frontend/app/admin/visitors/page.tsx` | `/admin/visitors` | Admin visitor list with search, pagination, and status toggle modal. |
| `frontend/app/admin/officers/page.tsx` | `/admin/officers` | Admin officer list with search, pagination, and status toggle modal. |
| `frontend/app/admin/officers/new/page.tsx` | `/admin/officers/new` | Admin create-officer form page. |
| `frontend/app/admin/officers/[officerId]/edit/page.tsx` | `/admin/officers/:officerId/edit` | Admin edit-officer page. |
| `frontend/app/admin/prisoners/page.tsx` | `/admin/prisoners` | Admin prisoner list with search, pagination, and status toggle modal. |
| `frontend/app/admin/prisoners/new/page.tsx` | `/admin/prisoners/new` | Admin create-prisoner form page. |
| `frontend/app/admin/prisoners/[prisonerId]/edit/page.tsx` | `/admin/prisoners/:prisonerId/edit` | Admin edit-prisoner page. |
| `frontend/app/admin/appointments/page.tsx` | `/admin/appointments` | Admin appointment list with status filter and pagination. |
| `frontend/app/admin/parole/page.tsx` | `/admin/parole` | Admin parole request list with status filter and pagination. |
| `frontend/app/admin/change-password/page.tsx` | `/admin/change-password` | Admin change-password page using shared form. |

### Visitor

| File | Route | Purpose |
| --- | --- | --- |
| `frontend/app/visitor/page.tsx` | `/visitor` | Redirect/entry wrapper for visitor area. |
| `frontend/app/visitor/dashboard/page.tsx` | `/visitor/dashboard` | Visitor dashboard summary cards. |
| `frontend/app/visitor/appointments/page.tsx` | `/visitor/appointments` | Visitor appointment status/list page. |
| `frontend/app/visitor/appointments/book/page.tsx` | `/visitor/appointments/book` | Visitor appointment booking page. |
| `frontend/app/visitor/settings/page.tsx` | `/visitor/settings` | Visitor profile/settings page. |
| `frontend/app/visitor/change-password/page.tsx` | `/visitor/change-password` | Visitor change-password page using shared form. |

### Officer

| File | Route | Purpose |
| --- | --- | --- |
| `frontend/app/officer/page.tsx` | `/officer` | Redirect/entry wrapper for officer area. |
| `frontend/app/officer/dashboard/page.tsx` | `/officer/dashboard` | Officer dashboard summary cards. |
| `frontend/app/officer/appointments/page.tsx` | `/officer/appointments` | Officer appointment review/list workflow. |
| `frontend/app/officer/parole/page.tsx` | `/officer/parole` | Officer parole review/list workflow. |
| `frontend/app/officer/change-password/page.tsx` | `/officer/change-password` | Officer change-password page using shared form. |

### Prisoner

| File | Route | Purpose |
| --- | --- | --- |
| `frontend/app/prisoner/page.tsx` | `/prisoner` | Redirect/entry wrapper for prisoner area. |
| `frontend/app/prisoner/dashboard/page.tsx` | `/prisoner/dashboard` | Prisoner dashboard summary/cards and profile-style panel. |
| `frontend/app/prisoner/parole/page.tsx` | `/prisoner/parole` | Prisoner parole request status/list page. |
| `frontend/app/prisoner/parole/request/page.tsx` | `/prisoner/parole/request` | Prisoner parole request creation page. |
| `frontend/app/prisoner/change-password/page.tsx` | `/prisoner/change-password` | Prisoner change-password page using shared form. |

## 2. Large Page Files

Large/mixed pages are a maintainability concern, not a current critical bug.

| File | Approx. lines | Risk | What is mixed |
| --- | ---: | --- | --- |
| `frontend/app/page.tsx` | 823 | High | Landing page markup, nav state, scroll state, active-section logic, legacy script loading, and large JSX are all in one page. Actively important public page. |
| `frontend/app/prisoner/dashboard/page.tsx` | 228 | Moderate | Protected-page state, dashboard API hook, fallback image handling, and large dashboard/profile JSX. |
| `frontend/app/admin/dashboard/page.tsx` | 203 | Moderate | Protected-page state, dashboard API hook, card configuration, quick links, and large JSX. |
| `frontend/app/admin/users/page.tsx` | 171 | High | Search/filter/page state, API loading, status modal state, selected user state, success/error handling, and JSX. Admin management is actively evolving. |
| `frontend/app/visitor/dashboard/page.tsx` | 140 | Moderate | Protected-page state, dashboard API hook, stat-card mapping, and JSX. |
| `frontend/app/prisoner/parole/page.tsx` | 131 | Moderate | Protected-page state, API loading, error handling, empty state, and list rendering. |
| `frontend/app/visitor/settings/page.tsx` | 128 | Moderate | Protected-page state, profile API loading, error/forbidden branches, and settings form wrapper. |
| `frontend/app/officer/appointments/page.tsx` | 117 | Moderate | Protected-page state, API loading, filter state, derived counts, and review list rendering. |
| `frontend/app/officer/parole/page.tsx` | 110 | Moderate | Protected-page state, API loading, error/forbidden branches, and parole review list rendering. |
| `frontend/app/visitor/appointments/page.tsx` | 104 | Moderate | Protected-page state, API loading, error/forbidden branches, and appointment list rendering. |
| `frontend/app/visitor/appointments/book/page.tsx` | 104 | Moderate | Protected-page state, prisoner-options API loading, error/forbidden branches, and booking form wrapper. |

Smaller admin CRUD pages are compressed into short one-line JSX returns, which is readable only with difficulty but not large by line count.

## 3. Components That Should Be Extracted

Do not extract these now. Good future candidates:

| Page | Candidate extraction |
| --- | --- |
| `frontend/app/page.tsx` | `LandingHeader`, `LandingHero`, `LandingAbout`, `LandingServices`, `LandingTeam`, `LandingContact`, `LandingFooter`, and `useLandingScripts`. |
| `frontend/app/admin/users/page.tsx` | `AdminUsersHeader`, `AdminUsersFilters`, `AdminUserDetailsPanel`, and `useAdminUsersList`. |
| `frontend/app/admin/dashboard/page.tsx` | `AdminDashboardStatGrid` and `AdminQuickLinks`. |
| `frontend/app/prisoner/dashboard/page.tsx` | `PrisonerProfileCard`, `PrisonerDashboardStats`, and `PrisonerDashboardNoticeCards`. |
| `frontend/app/visitor/dashboard/page.tsx` | `VisitorDashboardStats`. |
| `frontend/app/officer/appointments/page.tsx` | `OfficerAppointmentStats` and `useOfficerAppointmentsPage`. |
| `frontend/app/officer/parole/page.tsx` | `useOfficerParolePage`. |
| `frontend/app/prisoner/parole/page.tsx` | `PrisonerParoleEmptyState` and `usePrisonerParolePage`. |
| `frontend/app/visitor/settings/page.tsx` | `useVisitorSettingsPage`. |
| `frontend/app/visitor/appointments/page.tsx` | `useVisitorAppointmentsPage`. |
| `frontend/app/visitor/appointments/book/page.tsx` | `useVisitorAppointmentBookingPage`. |

## 4. Duplicated Forms / Tables / Status Badges

Repeated patterns found:

| Pattern | Files involved | Notes |
| --- | --- | --- |
| Status badge mappings for appointments | `frontend/components/visitor/VisitorAppointmentList.tsx`, `frontend/components/officer/OfficerAppointmentList.tsx` | Similar `statusLabels` and `statusClasses`; future shared `AppointmentStatusBadge` could reduce drift. |
| Status badge mappings for parole | `frontend/components/prisoner/ParoleStatusCard.tsx`, `frontend/components/officer/OfficerParoleList.tsx`, `frontend/components/admin/AdminParoleTable.tsx` | Some tables render raw status text while cards/lists style badges. |
| Active/inactive user badges | `frontend/components/admin/AdminUserTable.tsx`, `frontend/components/admin/AdminVisitorTable.tsx`, `frontend/components/admin/AdminOfficerTable.tsx`, `frontend/components/admin/AdminPrisonerTable.tsx` | Repeated active/inactive badge rendering. |
| Loading/error/access denied branches | Many role pages under `frontend/app/admin`, `frontend/app/visitor`, `frontend/app/officer`, `frontend/app/prisoner` | Repeated `alert alert-info`, `alert alert-danger`, and `Access denied` patterns. |
| Admin list page shell | `frontend/app/admin/users/page.tsx`, `frontend/app/admin/visitors/page.tsx`, `frontend/app/admin/officers/page.tsx`, `frontend/app/admin/prisoners/page.tsx`, `frontend/app/admin/appointments/page.tsx`, `frontend/app/admin/parole/page.tsx` | Similar protected page + API list + filters + pagination flow. |
| Pagination | `frontend/components/admin/Pagination.tsx` plus list pages manually deciding when to render it | Component exists, but usage pattern is repeated across pages. |
| Confirmation modal | `frontend/components/admin/UserStatusModal.tsx` used across admin lists | Reused well; no issue. |
| Form validation state | `frontend/components/auth/ChangePasswordForm.tsx`, `frontend/components/auth/VisitorRegisterForm.tsx`, `frontend/components/visitor/AppointmentBookingForm.tsx`, `frontend/components/prisoner/ParoleRequestForm.tsx`, `frontend/components/admin/OfficerForm.tsx`, `frontend/components/admin/PrisonerForm.tsx` | Each form handles its own client validation. This is acceptable now but can drift. |

## 5. Global CSS Risks

Files inspected:

- `frontend/app/layout.tsx`
- `frontend/app/globals.css`

Findings:

- Root layout imports only `./globals.css`; it does not globally import landing CSS, AOS CSS, Bootstrap, Sneat, Kaiadmin, officer, or prisoner legacy styles.
- The previous login/landing CSS leak has not regressed. Landing stylesheets are loaded through `frontend/components/legacy/landing/LandingAssets.tsx`, not the root layout.
- `globals.css` contains Tailwind directives, base `box-sizing`, `html/body` height, and `body margin`.
- `globals.css` also contains scoped `.login-page ...` styles. These are page-specific, but they are safely scoped under `.login-page` and were likely added to prevent the earlier login visibility issue. This is moderate cleanup, not critical.
- No unscoped global selector was found that hides content with broad `display: none`, `opacity: 0`, `visibility: hidden`, `height: 0`, or broad negative positioning.
- `.login-page .loading`, `.login-page .error-message`, and `.login-page .sent-message` use `display: none`, but only inside `.login-page`; this is not leaking into other pages.

## 6. Duplicate Legacy CSS Links

Inspected:

- `frontend/app/admin/layout.tsx`
- `frontend/app/visitor/layout.tsx`
- `frontend/app/officer/layout.tsx`
- `frontend/app/prisoner/layout.tsx`
- `frontend/components/legacy/admin/AdminLayout.tsx`
- `frontend/components/legacy/landing/LandingAssets.tsx`
- `frontend/app/page.tsx`

Findings:

- Landing CSS is scoped to `LandingAssets`, used by `/` and also imported by `VisitorRegisterForm` to preserve the old registration styling. It is not loaded globally in root layout.
- Visitor role CSS is scoped to `frontend/app/visitor/layout.tsx`.
- Officer role CSS is scoped to `frontend/app/officer/layout.tsx`.
- Prisoner role CSS is scoped to `frontend/app/prisoner/layout.tsx`.
- Admin CSS is loaded inside `frontend/components/legacy/admin/AdminLayout.tsx`, which is only used under `frontend/app/admin/layout.tsx`; this is effectively role scoped.
- No exact duplicate stylesheet path was found loaded twice inside the same role layout.
- `LoginForm` separately links `/legacy/landing/assets/vendor/bootstrap-icons/bootstrap-icons.css`. This is narrow and local to login rendering. It is not a duplicate on `/login` because `LandingAssets` is not rendered there.
- `VisitorRegisterForm` imports `LandingAssets`; this intentionally loads landing CSS for `/register`. It could be revisited later if registration styles are separated, but it is not currently a leak into all pages.

## 7. Scripts That Manipulate The DOM

DOM/browser access found:

| File | Access | Client component? | In `useEffect`? | Cleanup? | Finding |
| --- | --- | --- | --- | --- | --- |
| `frontend/app/page.tsx` | `document.querySelector`, `document.createElement`, `document.body.appendChild`, `window.scrollY`, `window.addEventListener`, `window.removeEventListener`, `window.scrollTo`, `document.getElementById`, `document.body.classList.toggle` | Yes | Mostly yes; `scrollToTop` is an event handler | Scroll listener cleaned up; injected scripts cleaned up; body page classes cleaned up by `LandingAssets` | Acceptable. Minor future cleanup: consolidate landing body-class cleanup in one hook. |
| `frontend/components/legacy/landing/LandingAssets.tsx` | `document.body.classList.add/remove` | Yes | Yes | Removes `index-page`, `mobile-nav-active`, `scrolled` | Acceptable. |
| `frontend/components/legacy/admin/AdminLayout.tsx` | `document.body.classList.add/remove` | Yes | Yes | Removes `admin-page` on unmount | Acceptable. |
| `frontend/components/legacy/visitor/VisitorLayout.tsx` | `document.body.classList.add/remove` | Yes | Yes | Removes `visitor-page` on unmount | Acceptable. |
| `frontend/components/legacy/officer/OfficerLayout.tsx` | `document.body.classList.add/remove/toggle` | Yes | Yes | Removes `officer-page` and `sidebar-shown` on unmount | Acceptable. |
| `frontend/components/legacy/prisoner/PrisonerLayout.tsx` | `document.body.classList.add/remove/toggle` | Yes | Yes | Removes `bg-theme`, `bg-theme1`, `prisoner-page`, and `toggled` on unmount | Acceptable. |
| `frontend/src/lib/auth.ts` | `window.localStorage` | Not a component | Guarded with `typeof window !== 'undefined'` | Not applicable | Acceptable utility usage. |
| `frontend/components/auth/ChangePasswordForm.tsx` | `window.setTimeout` | Yes | Event handler | Not cleaned up | Low/moderate: redirect timeout is short; cleanup could be added later if warnings appear. Not critical. |
| `frontend/components/auth/VisitorRegisterForm.tsx` | `window.setTimeout` | Yes | Event handler | Not cleaned up | Low/moderate only. |
| `frontend/components/visitor/AppointmentBookingForm.tsx` | `window.setTimeout` | Yes | Event handler | Not cleaned up | Low/moderate only. |
| `frontend/components/prisoner/ParoleRequestForm.tsx` | `window.setTimeout` | Yes | Event handler | Not cleaned up | Low/moderate only. |

No DOM manipulation was found in a server component. No global event listener without cleanup was found.

## 8. Components Suitable To Move Into `src/components`

Do not move these now. Future candidates:

| Component/group | Recommendation |
| --- | --- |
| `frontend/components/admin/AdminFilters.tsx` | Good future move. Reused and stable. |
| `frontend/components/admin/Pagination.tsx` | Good future move. Reused across admin lists. |
| `frontend/components/admin/UserStatusModal.tsx` | Good future move. Reused across admin management pages. |
| `frontend/components/admin/AdminUserTable.tsx` | Good future move after table/status badge cleanup. |
| `frontend/components/admin/AdminVisitorTable.tsx` | Good future move after table/status badge cleanup. |
| `frontend/components/admin/AdminOfficerTable.tsx` | Good future move after table/status badge cleanup. |
| `frontend/components/admin/AdminPrisonerTable.tsx` | Good future move after table/status badge cleanup. |
| `frontend/components/admin/AdminAppointmentTable.tsx` | Good future move; can become server component if no click handlers are added. |
| `frontend/components/admin/AdminParoleTable.tsx` | Good future move; can become server component if no click handlers are added. |
| `frontend/components/auth/LoginForm.tsx` | Stable shared auth component, but leave until login/register visual migration is fully settled. |
| `frontend/components/auth/VisitorRegisterForm.tsx` | Stable enough, but still tied to landing legacy assets; move later. |
| `frontend/components/auth/ChangePasswordForm.tsx` | Good future move after a little burn-in; reused across four role pages. |
| `frontend/components/visitor/*` | Move later after visitor workflow stabilizes. |
| `frontend/components/officer/*` | Move later after officer workflow stabilizes. |
| `frontend/components/prisoner/*` | Move later after prisoner workflow stabilizes. |
| `frontend/components/legacy/*` | Keep in `components/legacy` for now. These intentionally preserve old UI shells and are still tied to legacy CSS. |

`frontend/src/components/` currently exists with empty role/layout/ui directories. The split is not a bug.

## 9. Unused CSS / Assets

This is a reference/asset audit only. Do not delete anything from this list without a dedicated cleanup prompt.

Likely unused or partially unused public legacy paths:

| Path | Why it appears unused |
| --- | --- |
| `frontend/public/legacy/uploads` | No current `/legacy/uploads/...` references found in `frontend/app`, `frontend/components`, or `frontend/src`. |
| `frontend/public/legacy/admin/assets` | Current admin layout uses `/legacy/admin/assets1/...`; landing uses `/legacy/landing/...`. No current references found to `/legacy/admin/assets/...`. |
| `frontend/public/legacy/officer/assets` | Current officer layout uses `/legacy/officer/vendors/...`; no current references found to `/legacy/officer/assets/...`. |
| `frontend/public/legacy/officer/src` | Current officer layout uses `/legacy/officer/vendors/...`; no current references found to `/legacy/officer/src/...`. |
| `frontend/public/legacy/prisoner/assets1` | Current prisoner layout uses `/legacy/prisoner/assets/...`; no current references found to `/legacy/prisoner/assets1/...`. |
| `frontend/public/legacy/visitor/visitorpage/js` | Current visitor layout uses `/legacy/visitor/visitorpage/assets/...`; no current references found to this root `js` folder. |
| `frontend/public/legacy/visitor/visitorpage/libs` | Current visitor layout uses `/legacy/visitor/visitorpage/assets/vendor/libs/...`; no current references found to this root `libs` folder. |
| `frontend/public/legacy/visitor/visitorpage/scss` | Source SCSS/reference files; no current runtime references found. |
| `frontend/public/legacy/visitor/visitorpage/fonts` | Current visitor font CSS uses `/legacy/visitor/visitorpage/assets/vendor/fonts/...`; no current references found to this root `fonts` folder. |
| `frontend/public/legacy/visitor/visitorpage/html/*.html` | Old Sneat template HTML examples. Current app references only selected images from the `html` folder, not these template pages. |

Currently referenced public legacy paths include:

- `/legacy/landing/...`
- `/legacy/landing/assets/...`
- `/legacy/logos/...`
- `/legacy/videos/jailmeet_video.mp4`
- `/legacy/admin/assets1/...`
- `/legacy/visitor/visitorpage/assets/...`
- `/legacy/visitor/visitorpage/html/jmblack.png`
- `/legacy/visitor/visitorpage/html/userlogo.webp`
- `/legacy/officer/vendors/...`
- `/legacy/officer/officer.png`
- `/legacy/prisoner/assets/...`

## 10. `"use client"` Audit

### Files with `"use client"` and why

| File | Reason |
| --- | --- |
| `frontend/app/page.tsx` | Uses `useState`, `useEffect`, `window`, `document`, event handlers, and legacy script loading. |
| `frontend/app/admin/appointments/page.tsx` | Uses hooks, `window.location.search`, protected-page hook, and API state. |
| `frontend/app/admin/change-password/page.tsx` | Uses `useProtectedPage`. |
| `frontend/app/admin/dashboard/page.tsx` | Uses `useProtectedPage` and `useDashboard`. |
| `frontend/app/admin/officers/page.tsx` | Uses hooks, API state, modal state, and event handlers. |
| `frontend/app/admin/officers/new/page.tsx` | Uses `useState`, `useRouter`, protected-page hook. |
| `frontend/app/admin/officers/[officerId]/edit/page.tsx` | Uses `useState`, `useEffect`, `useRouter`, `useParams`, API state. |
| `frontend/app/admin/parole/page.tsx` | Uses hooks, `window.location.search`, protected-page hook, and API state. |
| `frontend/app/admin/prisoners/page.tsx` | Uses hooks, API state, modal state, and event handlers. |
| `frontend/app/admin/prisoners/new/page.tsx` | Uses `useState`, protected-page hook, and API submit. |
| `frontend/app/admin/prisoners/[prisonerId]/edit/page.tsx` | Uses hooks, `useParams`, protected-page hook, and API state. |
| `frontend/app/admin/users/page.tsx` | Uses hooks, API state, filters, selected user state, and modal state. |
| `frontend/app/admin/visitors/page.tsx` | Uses hooks, API state, filters, pagination, and modal state. |
| `frontend/app/visitor/dashboard/page.tsx` | Uses `useProtectedPage` and `useDashboard`. |
| `frontend/app/visitor/appointments/page.tsx` | Uses hooks, protected-page hook, and API state. |
| `frontend/app/visitor/appointments/book/page.tsx` | Uses hooks, protected-page hook, and API state. |
| `frontend/app/visitor/settings/page.tsx` | Uses hooks, protected-page hook, and API state. |
| `frontend/app/visitor/change-password/page.tsx` | Uses `useProtectedPage`. |
| `frontend/app/officer/dashboard/page.tsx` | Uses `useProtectedPage` and `useDashboard`. |
| `frontend/app/officer/appointments/page.tsx` | Uses hooks, protected-page hook, API state, and filters. |
| `frontend/app/officer/parole/page.tsx` | Uses hooks, protected-page hook, and API state. |
| `frontend/app/officer/change-password/page.tsx` | Uses `useProtectedPage`. |
| `frontend/app/prisoner/dashboard/page.tsx` | Uses `useProtectedPage` and `useDashboard`. |
| `frontend/app/prisoner/parole/page.tsx` | Uses hooks, protected-page hook, and API state. |
| `frontend/app/prisoner/parole/request/page.tsx` | Uses `useProtectedPage`. |
| `frontend/app/prisoner/change-password/page.tsx` | Uses `useProtectedPage`. |
| `frontend/components/auth/LoginForm.tsx` | Uses `useState`, `useRouter`, login API, and token storage through helpers. |
| `frontend/components/auth/VisitorRegisterForm.tsx` | Uses `useState`, `useRouter`, event handlers, and timeout redirect. |
| `frontend/components/auth/ChangePasswordForm.tsx` | Uses `useState`, `useRouter`, event handlers, and timeout redirect. |
| `frontend/components/legacy/landing/LandingAssets.tsx` | Uses `useEffect` and `document.body.classList`. |
| `frontend/components/legacy/admin/AdminLayout.tsx` | Uses `useState`, `useEffect`, and `document.body.classList`. |
| `frontend/components/legacy/admin/AdminNavbar.tsx` | Uses `useState`, `useRouter`, and logout/profile menu handlers. |
| `frontend/components/legacy/admin/AdminSidebar.tsx` | Has interactive callbacks from parent layout. |
| `frontend/components/legacy/visitor/VisitorLayout.tsx` | Uses `useState`, `useEffect`, and `document.body.classList`. |
| `frontend/components/legacy/visitor/VisitorNavbar.tsx` | Uses `useState`, `useRouter`, and logout/profile menu handlers. |
| `frontend/components/legacy/visitor/VisitorSidebar.tsx` | Mostly static; no obvious hook/browser API need. Candidate to become server later, but safe as client. |
| `frontend/components/legacy/officer/OfficerLayout.tsx` | Uses `useState`, `useEffect`, and `document.body.classList`. |
| `frontend/components/legacy/officer/OfficerNavbar.tsx` | Uses `useState`, `useRouter`, and logout/profile menu handlers. |
| `frontend/components/legacy/officer/OfficerSidebar.tsx` | Uses `useState` for menu groups. |
| `frontend/components/legacy/officer/OfficerFooter.tsx` | No current client-only behavior. Candidate to become server/null component later. |
| `frontend/components/legacy/prisoner/PrisonerLayout.tsx` | Uses `useState`, `useEffect`, and `document.body.classList`. |
| `frontend/components/legacy/prisoner/PrisonerNavbar.tsx` | Uses `useState`, `useRouter`, and logout/profile menu handlers. |
| `frontend/components/legacy/prisoner/PrisonerSidebar.tsx` | Mostly static except props; candidate to become server later if parent boundary allows. |
| `frontend/components/legacy/prisoner/PrisonerFooter.tsx` | No current client-only behavior. Candidate to become server/null component later. |
| `frontend/components/admin/AdminFilters.tsx` | Uses `useState`, `useEffect`, and form submit handlers. |
| `frontend/components/admin/Pagination.tsx` | Uses button `onClick` handlers. |
| `frontend/components/admin/UserStatusModal.tsx` | Uses button callbacks. |
| `frontend/components/admin/OfficerForm.tsx` | Uses form state, effect, and submit handler. |
| `frontend/components/admin/PrisonerForm.tsx` | Uses form state, effect, and submit handler. |
| `frontend/components/admin/AdminUserTable.tsx` | Uses event/callback props for actions. |
| `frontend/components/admin/AdminVisitorTable.tsx` | Uses event/callback props for actions. |
| `frontend/components/admin/AdminOfficerTable.tsx` | Uses event/callback props for actions. |
| `frontend/components/admin/AdminPrisonerTable.tsx` | Uses event/callback props for actions. |
| `frontend/components/admin/AdminAppointmentTable.tsx` | No current client-only behavior. Candidate to become server later. |
| `frontend/components/admin/AdminParoleTable.tsx` | No current client-only behavior. Candidate to become server later. |
| `frontend/components/visitor/AppointmentBookingForm.tsx` | Uses state, router, submit handler, and timeout redirect. |
| `frontend/components/visitor/VisitorAppointmentList.tsx` | Uses `useMemo`, `useState`, and filter buttons. |
| `frontend/components/visitor/VisitorSettingsForm.tsx` | Uses state, effect, router, and submit handler. |
| `frontend/components/officer/OfficerAppointmentList.tsx` | Uses state, router, and review action handlers. |
| `frontend/components/officer/OfficerParoleList.tsx` | Uses state, router, modal state, and review action handlers. |
| `frontend/components/officer/ParoleReviewModal.tsx` | Uses state and form submit handlers. |
| `frontend/components/prisoner/ParoleRequestForm.tsx` | Uses state, router, submit handler, `useMemo`, and timeout redirect. |
| `frontend/components/prisoner/PrisonerParoleList.tsx` | Uses state and `useMemo` for filtering. |
| `frontend/src/hooks/useProtectedPage.ts` | Hook uses `useRouter`, `useEffect`, and auth hook. |
| `frontend/src/hooks/useAuth.ts` | Hook uses `useState`, `useEffect`, and token helpers. |
| `frontend/src/hooks/useDashboard.ts` | Hook uses `useState`, `useEffect`, and async dashboard state. |

### Files with `"use client"` that may not need it

These are low-priority candidates only:

- `frontend/components/admin/AdminAppointmentTable.tsx`
- `frontend/components/admin/AdminParoleTable.tsx`
- `frontend/components/legacy/officer/OfficerFooter.tsx`
- `frontend/components/legacy/prisoner/PrisonerFooter.tsx`
- `frontend/components/legacy/visitor/VisitorSidebar.tsx`
- `frontend/components/legacy/prisoner/PrisonerSidebar.tsx`

### Files that appear to need `"use client"` but are missing it

None found.

## 11. Recommended Cleanup Order

### Critical

None.

No immediate CSS leakage, missing client boundary, duplicate critical stylesheet load, or unsafe DOM listener issue was found.

### Moderate

- Move scoped `.login-page` CSS out of `globals.css` into a CSS Module or route-local styling after confirming the login page still renders correctly.
- Extract large/mixed pages only when next touched: `frontend/app/page.tsx`, `frontend/app/admin/users/page.tsx`, dashboard pages, and role workflow pages.
- Create shared status badge helpers/components for appointments, parole, and active/inactive user state.
- Create shared loading/error/access-denied blocks after the current role UI shells stabilize.
- Normalize admin list page patterns into a shared hook or list-shell pattern later.
- Review `window.setTimeout` redirect handlers in forms and optionally add cleanup if any unmounted-state warnings appear.
- Consolidate landing body-class toggling/script initialization into a small hook after landing is stable.
- Consider separating `/register` from full `LandingAssets` if registration styling becomes more independent.

### Low

- Move stable shared components from `frontend/components` to `frontend/src/components` gradually, only when touched.
- Remove unnecessary `"use client"` from static table/footer/sidebar components after verifying import boundaries.
- Clean unused public legacy asset folders only after a dedicated backup/review step.
- Reformat compressed one-line JSX pages for readability when those pages are next edited.

## Risks And Surprises

- Several large old template asset folders remain under `public/legacy` even when only a subset is currently referenced. This increases public surface area and can make future audits noisy.
- `frontend/src/components` exists but is currently empty while active components live in `frontend/components`; this is not a runtime problem.
- Some admin pages are short by line count because multiple branches and JSX trees are compressed into long single lines. They are not broken, but they are harder to review safely.
- The current project is mixing three UI worlds: migrated landing Bootstrap UI, admin Kaiadmin UI, visitor Sneat UI, officer template UI, and prisoner legacy UI. This is expected for a UI-preserving migration, but CSS scoping should remain a recurring review point.
