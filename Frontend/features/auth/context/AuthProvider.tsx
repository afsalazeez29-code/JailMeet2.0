'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { isApiServiceError } from '@/types/api';
import { AuthContext, AuthContextValue } from './auth-context';
import { getCurrentUser } from '@features/auth/services/auth.service';
import type { AuthUser } from '@features/auth/types';
import {
  AUTH_CHANGED_EVENT,
  AUTH_CLEARED_EVENT,
  AUTH_FORBIDDEN_EVENT,
  clearAccessToken,
  getAccessToken,
} from '@features/auth/services/token.service';

type AuthProviderProps = {
  children: ReactNode;
};

type AuthState = Omit<AuthContextValue, 'reload' | 'updateUser'>;

const initialAuthState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  isUnauthenticated: false,
  isForbidden: false,
};

const unauthenticatedState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isUnauthenticated: true,
  isForbidden: false,
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((currentKey) => currentKey + 1);
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setAuthState((currentState) => ({
      ...currentState,
      user: currentState.user
        ? { ...currentState.user, ...updates }
        : currentState.user,
    }));
  }, []);

  useEffect(() => {
    const handleAuthCleared = () => setAuthState(unauthenticatedState);
    const handleAuthChanged = () => {
      setAuthState(initialAuthState);
      reload();
    };
    const handleForbidden = () => router.replace('/unauthorized');

    window.addEventListener(AUTH_CLEARED_EVENT, handleAuthCleared);
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    window.addEventListener(AUTH_FORBIDDEN_EVENT, handleForbidden);

    return () => {
      window.removeEventListener(AUTH_CLEARED_EVENT, handleAuthCleared);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
      window.removeEventListener(AUTH_FORBIDDEN_EVENT, handleForbidden);
    };
  }, [reload, router]);

  useEffect(() => {
    let isMounted = true;
    const token = getAccessToken();

    if (!token) {
      setAuthState(unauthenticatedState);
      return () => {
        isMounted = false;
      };
    }

    setAuthState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
      isUnauthenticated: false,
      isForbidden: false,
    }));

    const loadUser = async () => {
      try {
        const user = await getCurrentUser(token);

        if (!isMounted) return;

        setAuthState({
          user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
          isUnauthenticated: false,
          isForbidden: false,
        });
      } catch (error) {
        if (!isMounted) return;

        if (isApiServiceError(error) && error.status === 401) {
          clearAccessToken();
          setAuthState(unauthenticatedState);
          return;
        }

        if (isApiServiceError(error) && error.status === 403) {
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,
            isUnauthenticated: false,
            isForbidden: true,
          });
          return;
        }

        setAuthState({
          user: null,
          isLoading: false,
          error:
            isApiServiceError(error) && error.message
              ? error.message
              : 'Unable to load authenticated user',
          isAuthenticated: false,
          isUnauthenticated: false,
          isForbidden: false,
        });
      }
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...authState, reload, updateUser }),
    [authState, reload, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
