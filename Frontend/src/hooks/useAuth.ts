'use client';

import { useCallback, useEffect, useState } from 'react';

import { clearAccessToken, getAccessToken } from '@/lib/auth';
import { getCurrentUser } from '@/services/auth.service';
import { isApiServiceError } from '@/types/api';
import { AuthUser } from '@/types/auth';

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  isForbidden: boolean;
};

const initialAuthState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  isUnauthenticated: false,
  isForbidden: false,
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((currentKey) => currentKey + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const token = getAccessToken();

    if (!token) {
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        isUnauthenticated: true,
        isForbidden: false,
      });
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

        if (!isMounted) {
          return;
        }

        setAuthState({
          user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
          isUnauthenticated: false,
          isForbidden: false,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isApiServiceError(error)) {
          if (error.status === 401) {
            clearAccessToken();
            setAuthState({
              user: null,
              isLoading: false,
              error: null,
              isAuthenticated: false,
              isUnauthenticated: true,
              isForbidden: false,
            });
            return;
          }

          if (error.status === 403) {
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
            error: error.message || 'Unable to load authenticated user',
            isAuthenticated: false,
            isUnauthenticated: false,
            isForbidden: false,
          });
          return;
        }

        setAuthState({
          user: null,
          isLoading: false,
          error: 'Unable to load authenticated user',
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

  return {
    ...authState,
    reload,
  };
};
