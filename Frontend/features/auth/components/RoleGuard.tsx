'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@features/auth/hooks/useAuth';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { Role } from '@features/auth/types';

import styles from './RoleGuard.module.css';

type RoleGuardProps = {
  children: ReactNode;
  expectedRole: Role;
};

export default function RoleGuard({ children, expectedRole }: RoleGuardProps) {
  const auth = useAuth();
  const router = useRouter();
  const redirectTargetRef = useRef<string | null>(null);
  const hasRoleMismatch = Boolean(
    auth.user && auth.user.role !== expectedRole,
  );

  useEffect(() => {
    if (auth.isLoading || auth.error) return;

    if (auth.isUnauthenticated) {
      const loginRoute = `/login?role=${expectedRole.toLowerCase()}`;

      if (redirectTargetRef.current !== loginRoute) {
        redirectTargetRef.current = loginRoute;
        navigateToLogin(router, 'replace', expectedRole);
      }
      return;
    }

    if (auth.isForbidden || hasRoleMismatch) {
      if (redirectTargetRef.current !== '/unauthorized') {
        redirectTargetRef.current = '/unauthorized';
        router.replace('/unauthorized');
      }
    }
  }, [
    auth.error,
    auth.isForbidden,
    auth.isLoading,
    auth.isUnauthenticated,
    expectedRole,
    hasRoleMismatch,
    router,
  ]);

  const canRender =
    !auth.isLoading &&
    !auth.error &&
    auth.isAuthenticated &&
    !auth.isForbidden &&
    !hasRoleMismatch;

  if (canRender) return children;

  if (auth.error) {
    return (
      <main className={styles.statePage}>
        <div className={styles.stateCard} role="alert">
          <h1>Unable to verify your session</h1>
          <p>{auth.error}</p>
          <button type="button" onClick={auth.reload}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.statePage} aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p>Checking access...</p>
    </main>
  );
}
