'use client';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';

import ParoleRequestForm from '@features/parole/components/ParoleRequestForm';

export default function PrisonerParoleRequestPage() {
  const protectedPage = useProtectedPage();

  if (
    protectedPage.isLoading ||
    (!protectedPage.isReady &&
      !protectedPage.isForbidden &&
      !protectedPage.error)
  ) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-info mb-0">
            Loading parole request form...
          </div>
        </div>
      </div>
    );
  }

  if (protectedPage.isForbidden) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger mb-0">Access denied</div>
        </div>
      </div>
    );
  }

  if (protectedPage.error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger mb-0">{protectedPage.error}</div>
        </div>
      </div>
    );
  }

  return <ParoleRequestForm />;
}
