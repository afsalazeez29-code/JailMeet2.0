'use client';

import ErrorPage from '@features/auth/components/ErrorPage';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({
  error: _error,
  reset,
}: GlobalErrorProps) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ErrorPage
          code="500"
          title="Something Went Wrong"
          message="An unexpected error occurred. Please try again."
          onRetry={reset}
          secondaryAction={{ href: '/', label: 'Return to Home', kind: 'home' }}
        />
      </body>
    </html>
  );
}
