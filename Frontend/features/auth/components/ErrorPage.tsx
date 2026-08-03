'use client';

import { House, LayoutDashboard, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import styles from './ErrorPage.module.css';

type ErrorPageAction = {
  href: string;
  label: string;
  kind?: 'dashboard' | 'home';
};

type ErrorPageProps = {
  code: string;
  title: string;
  message: string;
  primaryAction?: ErrorPageAction;
  secondaryAction?: ErrorPageAction;
  onRetry?: () => void;
  retryLabel?: string;
};

function ActionIcon({ kind }: Pick<ErrorPageAction, 'kind'>) {
  if (kind === 'dashboard') {
    return <LayoutDashboard aria-hidden="true" size={18} strokeWidth={2.2} />;
  }

  return <House aria-hidden="true" size={18} strokeWidth={2.2} />;
}

export default function ErrorPage({
  code,
  title,
  message,
  primaryAction,
  secondaryAction,
  onRetry,
  retryLabel = 'Try Again',
}: ErrorPageProps) {
  return (
    <main className={styles.page}>
      <section
        className={styles.card}
        aria-labelledby="error-title"
        aria-describedby="error-message"
      >
        <p className={styles.code} aria-label={`Error ${code}`}>
          {code}
        </p>
        <h1 id="error-title">{title}</h1>
        <p className={styles.message} id="error-message">
          {message}
        </p>

        <div className={styles.actions}>
          {onRetry ? (
            <button
              className={styles.primaryAction}
              type="button"
              onClick={onRetry}
            >
              <RefreshCw aria-hidden="true" size={18} strokeWidth={2.2} />
              {retryLabel}
            </button>
          ) : primaryAction ? (
            <Link className={styles.primaryAction} href={primaryAction.href}>
              <ActionIcon kind={primaryAction.kind} />
              {primaryAction.label}
            </Link>
          ) : null}

          {secondaryAction ? (
            <Link
              className={styles.secondaryAction}
              href={secondaryAction.href}
            >
              <ActionIcon kind={secondaryAction.kind} />
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </section>

      <p className={styles.assurance}>
        <span aria-hidden="true">&#9671;</span>
        Secure. Private. Connected. <strong>JailMeet</strong>
      </p>
    </main>
  );
}
