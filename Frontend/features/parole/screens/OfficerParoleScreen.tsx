'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import { useEffect, useState } from 'react';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getOfficerParoleRequests } from '@features/parole/services/parole.service';
import { isApiServiceError } from '@/types/api';
import { OfficerParoleRequest } from '@features/parole/types';

import OfficerParoleList from '@features/parole/components/OfficerParoleList';

export default function OfficerParolePage() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [requests, setRequests] = useState<OfficerParoleRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let isMounted = true;

    const loadRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getOfficerParoleRequests('PENDING');

        if (isMounted) {
          setRequests(data);
        }
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        if (isApiServiceError(caughtError)) {
          if (caughtError.status === 401) {
            redirectToLogin();
            return;
          }

          if (caughtError.status === 403) {
            setError('Access denied');
            return;
          }

          setError(caughtError.message || 'Unable to load parole requests');
          return;
        }

        setError('Unable to load parole requests');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadRequests();

    return () => {
      isMounted = false;
    };
  }, [isReady, redirectToLogin]);

  const handleReviewed = (updatedRequest: OfficerParoleRequest) => {
    setRequests((currentRequests) =>
      currentRequests.filter((request) => request.id !== updatedRequest.id),
    );
  };

  if (
    protectedPage.isLoading ||
    loading ||
    (!protectedPage.isReady &&
      !protectedPage.isForbidden &&
      !protectedPage.error)
  ) {
    return (
      <div className="pd-20">
        <LoadingAlert>Loading parole requests...</LoadingAlert>
      </div>
    );
  }

  if (protectedPage.isForbidden || error === 'Access denied') {
    return (
      <div className="pd-20">
        <ForbiddenAlert />
      </div>
    );
  }

  if (protectedPage.error || error) {
    return (
      <div className="pd-20">
        <ErrorAlert>{protectedPage.error || error}</ErrorAlert>
      </div>
    );
  }

  return <OfficerParoleList onReviewed={handleReviewed} requests={requests} />;
}


