'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import { useEffect, useState } from 'react';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getOfficerParoleRequests } from '@features/parole/services/parole.service';
import { isApiServiceError } from '@/types/api';
import { OfficerParoleRequest, ParoleStatus } from '@features/parole/types';

import OfficerParoleList from '@features/parole/components/OfficerParoleList';

export default function OfficerParolePage() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [requests, setRequests] = useState<OfficerParoleRequest[]>([]);
  const [filter, setFilter] = useState<ParoleStatus | 'ALL'>(() => {
    if (typeof window === 'undefined') return 'PENDING';
    const value = new URLSearchParams(window.location.search).get('status');
    return ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].includes(value || '') ? value as ParoleStatus | 'ALL' : 'PENDING';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let isMounted = true;

    const loadRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getOfficerParoleRequests(filter);

        if (isMounted) {
          setRequests(data.items);
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
  }, [filter, isReady, redirectToLogin, reloadKey]);

  const handleReviewed = (updatedRequest: OfficerParoleRequest) => {
    setRequests((currentRequests) =>
      filter === 'ALL'
        ? currentRequests.map((request) => request.reference === updatedRequest.reference ? updatedRequest : request)
        : currentRequests.filter((request) => request.reference !== updatedRequest.reference),
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

  return <><div className="pd-20 pb-0 d-flex flex-wrap gap-2" role="group" aria-label="Parole status filter">{(['PENDING', 'ACCEPTED', 'REJECTED', 'ALL'] as const).map((status) => <button className={`btn ${filter === status ? 'btn-primary' : 'btn-outline-primary'}`} key={status} onClick={() => setFilter(status)} type="button">{status === 'ACCEPTED' ? 'Approved' : status.charAt(0) + status.slice(1).toLowerCase()}</button>)}</div><OfficerParoleList onRefresh={() => setReloadKey((value) => value + 1)} onReviewed={handleReviewed} requests={requests} /></>;
}


