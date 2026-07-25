'use client';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { LoadingAlert, ErrorAlert, ForbiddenAlert } from '@components/common/StatusAlert';

export default function VisitorProfilePage() {
  const protectedPage = useProtectedPage();

  if (
    protectedPage.isLoading ||
    (!protectedPage.isReady && !protectedPage.isForbidden && !protectedPage.error)
  ) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <LoadingAlert>Loading profile...</LoadingAlert>
      </div>
    );
  }

  if (protectedPage.isForbidden) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ForbiddenAlert>You do not have permission to view this page.</ForbiddenAlert>
      </div>
    );
  }

  if (protectedPage.error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ErrorAlert>{protectedPage.error}</ErrorAlert>
      </div>
    );
  }

  if (!protectedPage.isReady) {
    return null;
  }

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">Account /</span> My Profile
      </h4>
      <div className="card">
        <div className="card-body">
          <p className="mb-0 text-muted">Profile details will be available here.</p>
        </div>
      </div>
    </div>
  );
}
