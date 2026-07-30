'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@features/auth/hooks/useAuth';
import {
  getRoleDashboardRoute,
  navigateToLogin,
} from '@features/auth/services/navigation.service';

import styles from './AccessDeniedPage.module.css';

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
      <main className={styles.page}>
        <section className={styles.card} role="alert">
          <h1>Unable to verify your session</h1>
          <p>{auth.error ?? 'Please sign in again.'}</p>
          <button type="button" onClick={auth.reload}>
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.code}>403</span>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        <div className={styles.actions}>
          <Link
            className={styles.primaryAction}
            href={getRoleDashboardRoute(auth.user.role)}
          >
            Go to My Dashboard
          </Link>
          <Link className={styles.secondaryAction} href="/">
            Return to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
