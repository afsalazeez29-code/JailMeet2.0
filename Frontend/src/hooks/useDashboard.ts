'use client';

import { useCallback, useEffect, useState } from 'react';

import { clearAccessToken } from '@/lib/auth';
import { isApiServiceError } from '@/types/api';

type DashboardState<TData> = {
  data: TData | null;
  status: 'idle' | 'loading' | 'ready' | 'error' | 'forbidden' | 'unauthenticated';
  error: string | null;
};

type UseDashboardOptions = {
  enabled?: boolean;
  onUnauthenticated?: () => void;
};

const createInitialDashboardState = <TData,>(): DashboardState<TData> => ({
  data: null,
  status: 'idle',
  error: null,
});

export const useDashboard = <TData,>(
  loader: () => Promise<TData>,
  options: UseDashboardOptions = {},
) => {
  const { enabled = true, onUnauthenticated } = options;
  const [dashboardState, setDashboardState] = useState<DashboardState<TData>>(
    createInitialDashboardState<TData>,
  );
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((currentKey) => currentKey + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    setDashboardState((currentState) => ({
      ...currentState,
      status: 'loading',
      error: null,
    }));

    const loadDashboard = async () => {
      try {
        const data = await loader();

        if (!isMounted) {
          return;
        }

        setDashboardState({
          data,
          status: 'ready',
          error: null,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isApiServiceError(error)) {
          if (error.status === 401) {
            clearAccessToken();
            setDashboardState({
              data: null,
              status: 'unauthenticated',
              error: null,
            });
            onUnauthenticated?.();
            return;
          }

          if (error.status === 403) {
            setDashboardState({
              data: null,
              status: 'forbidden',
              error: null,
            });
            return;
          }

          setDashboardState({
            data: null,
            status: 'error',
            error: error.message || 'Unable to load dashboard',
          });
          return;
        }

        setDashboardState({
          data: null,
          status: 'error',
          error: 'Unable to load dashboard',
        });
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [enabled, loader, onUnauthenticated, reloadKey]);

  return {
    data: dashboardState.data,
    isLoading:
      enabled &&
      (dashboardState.status === 'idle' ||
        dashboardState.status === 'loading'),
    error: dashboardState.error,
    isForbidden: dashboardState.status === 'forbidden',
    isUnauthenticated: dashboardState.status === 'unauthenticated',
    reload,
  };
};
