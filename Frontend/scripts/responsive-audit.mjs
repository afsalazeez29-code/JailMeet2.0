import { chromium } from 'playwright';

const BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const ACCESS_TOKEN_KEY = 'jailmeet_access_token';

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
];

const users = {
  ADMIN: { email: 'admin@jailmeet.com', password: 'admin123' },
  OFFICER: { email: 'officer@jailmeet.com', password: 'officer123' },
  VISITOR: { email: 'visitor@jailmeet.com', password: 'visitor123' },
  PRISONER: { email: 'prisoner@jailmeet.com', password: 'prisoner123' },
};

const staticRoutes = [
  { path: '/', name: 'Landing' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Visitor Register' },
  { path: '/admin/dashboard', name: 'Admin Dashboard', role: 'ADMIN' },
  { path: '/admin/users', name: 'Admin Users', role: 'ADMIN' },
  { path: '/admin/visitors', name: 'Admin Visitors', role: 'ADMIN' },
  { path: '/admin/officers', name: 'Admin Officers', role: 'ADMIN' },
  { path: '/admin/officers/new', name: 'Admin Create Officer', role: 'ADMIN' },
  { path: '/admin/prisoners', name: 'Admin Prisoners', role: 'ADMIN' },
  { path: '/admin/prisoners/new', name: 'Admin Create Prisoner', role: 'ADMIN' },
  { path: '/admin/appointments', name: 'Admin Appointments', role: 'ADMIN' },
  { path: '/admin/parole', name: 'Admin Parole', role: 'ADMIN' },
  { path: '/admin/change-password', name: 'Admin Change Password', role: 'ADMIN' },
  { path: '/visitor/dashboard', name: 'Visitor Dashboard', role: 'VISITOR' },
  { path: '/visitor/settings', name: 'Visitor Settings', role: 'VISITOR' },
  {
    path: '/visitor/appointments/book',
    name: 'Visitor Book Appointment',
    role: 'VISITOR',
  },
  {
    path: '/visitor/appointments',
    name: 'Visitor Appointment History',
    role: 'VISITOR',
  },
  {
    path: '/visitor/change-password',
    name: 'Visitor Change Password',
    role: 'VISITOR',
  },
  { path: '/officer/dashboard', name: 'Officer Dashboard', role: 'OFFICER' },
  {
    path: '/officer/appointments',
    name: 'Officer Appointments',
    role: 'OFFICER',
  },
  { path: '/officer/parole', name: 'Officer Parole Reviews', role: 'OFFICER' },
  {
    path: '/officer/change-password',
    name: 'Officer Change Password',
    role: 'OFFICER',
  },
  { path: '/prisoner/dashboard', name: 'Prisoner Dashboard', role: 'PRISONER' },
  {
    path: '/prisoner/parole/request',
    name: 'Prisoner Parole Request',
    role: 'PRISONER',
  },
  {
    path: '/prisoner/parole',
    name: 'Prisoner Parole History',
    role: 'PRISONER',
  },
  {
    path: '/prisoner/change-password',
    name: 'Prisoner Change Password',
    role: 'PRISONER',
  },
];

const login = async (role) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(users[role]),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success || !payload?.data?.accessToken) {
    throw new Error(
      `Login failed for ${role}: HTTP ${response.status} ${JSON.stringify(payload)}`,
    );
  }

  return payload.data.accessToken;
};

const fetchFirstRecordId = async (path, token, keys) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  const data = payload?.data;
  const candidates = [
    data?.items,
    data?.records,
    data?.users,
    data?.officers,
    data?.prisoners,
    data?.data,
    Array.isArray(data) ? data : null,
  ];
  const first = candidates.find((candidate) => Array.isArray(candidate))?.[0];

  if (!first) {
    return null;
  }

  for (const key of keys) {
    if (first[key]) {
      return first[key];
    }
  }

  return first.id || null;
};

const buildRoutes = async (tokens) => {
  const routes = [...staticRoutes];
  const officerId = await fetchFirstRecordId('/admin/officers', tokens.ADMIN, [
    'id',
    'userId',
    'officerId',
  ]);
  const prisonerId = await fetchFirstRecordId('/admin/prisoners', tokens.ADMIN, [
    'id',
    'userId',
    'prisonerId',
  ]);

  if (officerId) {
    routes.push({
      path: `/admin/officers/${officerId}/edit`,
      name: 'Admin Edit Officer',
      role: 'ADMIN',
    });
  } else {
    console.log('SKIP dynamic route: no officer record found for edit page');
  }

  if (prisonerId) {
    routes.push({
      path: `/admin/prisoners/${prisonerId}/edit`,
      name: 'Admin Edit Prisoner',
      role: 'ADMIN',
    });
  } else {
    console.log('SKIP dynamic route: no prisoner record found for edit page');
  }

  return routes;
};

const findOverflowingElements = async (page) =>
  page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const isValidInternalScroller = (element) =>
      element.closest(
        '.table-responsive, .carousel, pre, code, .overflow-auto, .overflow-x-auto',
      );

    return [...document.querySelectorAll('body *')]
      .filter((element) => {
        if (isValidInternalScroller(element)) {
          return false;
        }

        const rect = element.getBoundingClientRect();
        return (
          rect.right > viewportWidth + 1 ||
          rect.left < -1 ||
          element.scrollWidth > element.clientWidth + 1
        );
      })
      .slice(0, 12)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className:
            typeof element.className === 'string'
              ? element.className
              : String(element.className),
          id: element.id,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      });
  });

const auditRoute = async (browser, route, viewport, token) => {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(
    ({ key, value }) => {
      if (value) {
        window.localStorage.setItem(key, value);
      }
    },
    { key: ACCESS_TOKEN_KEY, value: token },
  );
  const page = await context.newPage();
  const failures = [];

  page.on('pageerror', (error) => {
    failures.push(`client error: ${error.message}`);
  });

  const response = await page.goto(`${BASE_URL}${route.path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 12000,
  });

  await page.waitForTimeout(750);

  const status = response?.status() ?? 0;
  const pageOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyClientWidth: document.body.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  const elements = pageOverflow ? await findOverflowingElements(page) : [];

  await context.close();

  if (status >= 400) {
    failures.push(`HTTP ${status}`);
  }

  if (pageOverflow) {
    failures.push(
      `page overflow ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`,
    );
  }

  return {
    ok: failures.length === 0,
    route,
    viewport,
    status,
    dimensions,
    failures,
    elements,
  };
};

const main = async () => {
  console.log(`Responsive audit target: ${BASE_URL}`);
  console.log(`API target: ${API_BASE_URL}`);

  const tokens = {};
  for (const role of Object.keys(users)) {
    tokens[role] = await login(role);
    console.log(`Authenticated ${role}`);
  }

  const routes = await buildRoutes(tokens);
  const browser = await chromium.launch();
  const results = [];

  for (const viewport of viewports) {
    for (const route of routes) {
      const result = await auditRoute(
        browser,
        route,
        viewport,
        route.role ? tokens[route.role] : null,
      );
      results.push(result);
      const label = `${route.name} ${route.path} @ ${viewport.width}x${viewport.height}`;
      console.log(`${result.ok ? 'PASS' : 'FAIL'} ${label}`);
      if (!result.ok) {
        console.log(`  ${result.failures.join('; ')}`);
        console.table(result.elements);
      }
    }
  }

  await browser.close();

  const failed = results.filter((result) => !result.ok);
  console.log('============================');
  console.log(
    `RESPONSIVE AUDIT SUMMARY: ${results.length - failed.length} passed, ${failed.length} failed`,
  );
  console.log('============================');

  if (failed.length > 0) {
    for (const result of failed) {
      console.log(
        `FAILED: ${result.route.name} ${result.route.path} @ ${result.viewport.width}x${result.viewport.height}`,
      );
    }
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
