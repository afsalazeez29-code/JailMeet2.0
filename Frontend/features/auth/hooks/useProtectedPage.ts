'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { useAuth } from '@features/auth/hooks/useAuth';

export const useProtectedPage = () => {
  const router = useRouter();
  const hasRedirectedRef = useRef(false);
  const auth = useAuth();

  const redirectToLogin = useCallback(() => {
    if (hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    clearAccessToken();
    navigateToLogin(router);
  }, [router]);

  useEffect(() => {
    if (!auth.isLoading && auth.isUnauthenticated) {
      redirectToLogin();
    }
  }, [auth.isLoading, auth.isUnauthenticated, redirectToLogin]);

  return {
    user: auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
    isForbidden: auth.isForbidden,
    isReady:
      !auth.isLoading &&
      auth.isAuthenticated &&
      !auth.isForbidden &&
      !auth.error,
    isAuthenticated: auth.isAuthenticated,
    isUnauthenticated: auth.isUnauthenticated,
    reload: auth.reload,
    redirectToLogin,
  };
};


