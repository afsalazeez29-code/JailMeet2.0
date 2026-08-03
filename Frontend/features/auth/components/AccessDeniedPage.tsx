'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@features/auth/hooks/useAuth';
import {
  getRoleDashboardRoute,
  navigateToLogin,
} from '@features/auth/services/navigation.service';

import ErrorPage from './ErrorPage';
import styles from './RoleGuard.module.css';

export default function AccessDeniedPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && auth.isUnauthenticated) {
      navigateToLogin(router, 'replace', 'VISITOR');
    }
  }, [auth.isLoading, auth.isUnauthenticated, router]);

  if (auth.isLoading || auth.isUnauthenticated) {
    return (
      <main className={styles.page} aria-live="polite">
        <p>Checking access...</p>
      </main>
    );
  }

  if (auth.error || !auth.user) {
    return (
      <ErrorPage
        code="500"
        title="Unable to Verify Your Session"
        message="We could not verify your session. Please try again."
        onRetry={auth.reload}
        secondaryAction={{ href: '/', label: 'Return to Home', kind: 'home' }}
      />
    );
  }

  return (
    <ErrorPage
      code="403"
      title="Access Denied"
      message="You do not have permission to access this page."
      primaryAction={{
        href: getRoleDashboardRoute(auth.user.role),
        label: 'Go to My Dashboard',
        kind: 'dashboard',
      }}
      secondaryAction={{ href: '/', label: 'Return to Home', kind: 'home' }}
    />
  );
}
