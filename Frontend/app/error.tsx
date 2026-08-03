'use client';

import ErrorPage from '@features/auth/components/ErrorPage';

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error: _error, reset }: AppErrorProps) {
  return (
    <ErrorPage
      code="500"
      title="Something Went Wrong"
      message="An unexpected error occurred. Please try again."
      onRetry={reset}
      secondaryAction={{ href: '/', label: 'Return to Home', kind: 'home' }}
    />
  );
}
