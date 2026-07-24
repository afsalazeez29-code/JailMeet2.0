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
): void => {
  router[method](LOGIN_ROUTE);
};

export const navigateToLoginAfterPasswordChange = (
  router: AuthRouter,
): number =>
  window.setTimeout(
    () => navigateToLogin(router),
    PASSWORD_CHANGE_LOGIN_DELAY_MS,
  );
