'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { clearAccessToken } from '@features/auth/services/token.service';
import { getPrisonerParoleRequests } from '@features/parole/services/parole.service';
import { isApiServiceError } from '@/types/api';
import { PrisonerParoleRequest } from '@features/parole/types';

import PrisonerParoleList from '@features/parole/components/PrisonerParoleList';

export default function PrisonerParolePage() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [requests, setRequests] = useState<PrisonerParoleRequest[]>([]);
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
        const data = await getPrisonerParoleRequests();

        if (isMounted) {
          setRequests(data);
        }
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        if (isApiServiceError(caughtError)) {
          if (caughtError.status === 401) {
            clearAccessToken();
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

  if (
    protectedPage.isLoading ||
    loading ||
    (!protectedPage.isReady &&
      !protectedPage.isForbidden &&
      !protectedPage.error)
  ) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-info mb-0">
            Loading parole requests...
          </div>
        </div>
      </div>
    );
  }

  if (protectedPage.isForbidden || error === 'Access denied') {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger mb-0">Access denied</div>
        </div>
      </div>
    );
  }

  if (protectedPage.error || error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger mb-0">
            {protectedPage.error || error}
          </div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <h5>No parole requests yet</h5>
          <p className="text-muted">
            Submit your first parole request to begin the review process.
          </p>
          <Link href="/prisoner/parole/request" className="btn btn-primary">
            Submit Parole Request
          </Link>
        </div>
      </div>
    );
  }

  return <PrisonerParoleList requests={requests} />;
}
