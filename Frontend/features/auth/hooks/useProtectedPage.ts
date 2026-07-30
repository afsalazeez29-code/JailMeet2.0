'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { useAuth } from '@features/auth/hooks/useAuth';
import { Role } from '@features/auth/types';

const pathRoles: Record<string, Role> = {
  admin: 'ADMIN',
  officer: 'OFFICER',
  visitor: 'VISITOR',
  prisoner: 'PRISONER',
};

export const useProtectedPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);
  const auth = useAuth();
  const expectedRole = pathRoles[pathname.split('/')[1]];
  const hasRoleMismatch = Boolean(
    expectedRole && auth.user && auth.user.role !== expectedRole,
  );

  const redirectToLogin = useCallback(() => {
    if (hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    clearAccessToken();
    navigateToLogin(router, 'replace', expectedRole);
  }, [expectedRole, router]);

  useEffect(() => {
    if (!auth.isLoading && auth.isUnauthenticated) {
      redirectToLogin();
    }
  }, [auth.isLoading, auth.isUnauthenticated, redirectToLogin]);

  return {
    user: auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
    isForbidden: auth.isForbidden || hasRoleMismatch,
    isReady:
      !auth.isLoading &&
      auth.isAuthenticated &&
      !auth.isForbidden &&
      !hasRoleMismatch &&
      !auth.error,
    isAuthenticated: auth.isAuthenticated,
    isUnauthenticated: auth.isUnauthenticated,
    reload: auth.reload,
    redirectToLogin,
  };
};


