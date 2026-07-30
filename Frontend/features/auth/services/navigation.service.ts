import { Role } from '@features/auth/types';

export type AuthRouter = {
  push: (href: string) => void;
  replace: (href: string) => void;
};

export const LOGIN_ROUTE = '/login';
export const HOME_ROUTE = '/';
export const PASSWORD_CHANGE_LOGIN_DELAY_MS = 900;

export const roleDashboardRoutes: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  OFFICER: '/officer/dashboard',
  VISITOR: '/visitor/dashboard',
  PRISONER: '/prisoner/dashboard',
};

export const getRoleDashboardRoute = (role: Role): string =>
  roleDashboardRoutes[role];

export const getRoleLoginRoute = (role?: Role): string =>
  role ? `${LOGIN_ROUTE}?role=${role.toLowerCase()}` : LOGIN_ROUTE;

export const parseAuthRole = (
  value: string | string[] | undefined,
): Role | null => {
  const normalized = Array.isArray(value) ? value[0] : value;

  switch (normalized?.toLowerCase()) {
    case 'admin':
      return 'ADMIN';
    case 'officer':
      return 'OFFICER';
    case 'visitor':
      return 'VISITOR';
    case 'prisoner':
      return 'PRISONER';
    default:
      return null;
  }
};

export const navigateToRoleDashboard = (
  router: AuthRouter,
  role: Role,
): void => {
  router.push(getRoleDashboardRoute(role));
};

export const navigateToHome = (router: AuthRouter): void => {
  router.push(HOME_ROUTE);
};

export const navigateToLogin = (
  router: AuthRouter,
  method: 'push' | 'replace' = 'replace',
  role?: Role,
): void => {
  router[method](getRoleLoginRoute(role));
};

export const navigateToLoginAfterPasswordChange = (
  router: AuthRouter,
): number =>
  window.setTimeout(
    () => navigateToLogin(router),
    PASSWORD_CHANGE_LOGIN_DELAY_MS,
  );
