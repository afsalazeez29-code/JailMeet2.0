'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
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
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <div className="card-body">
            <LoadingAlert className="mb-0">Loading parole request form...</LoadingAlert>
          </div>
        </div>
      </div>
    );
  }

  if (protectedPage.isForbidden) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <div className="card-body">
            <ForbiddenAlert className="mb-0" />
          </div>
        </div>
      </div>
    );
  }

  if (protectedPage.error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <div className="card-body">
            <ErrorAlert className="mb-0">{protectedPage.error}</ErrorAlert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <ParoleRequestForm />
    </div>
  );
}


