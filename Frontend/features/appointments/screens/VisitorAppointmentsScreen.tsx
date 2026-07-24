'use client';

import { useEffect, useState } from 'react';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getVisitorAppointments } from '@features/appointments/services/appointment.service';
import { isApiServiceError } from '@/types/api';
import { VisitorAppointment } from '@features/appointments/types';

import VisitorAppointmentList from '@features/appointments/components/VisitorAppointmentList';

export default function VisitorAppointmentsPage() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [appointments, setAppointments] = useState<VisitorAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let isMounted = true;

    const loadAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getVisitorAppointments();

        if (isMounted) {
          setAppointments(data);
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

          setError(caughtError.message || 'Unable to load appointments');
          return;
        }

        setError('Unable to load appointments');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadAppointments();

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
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-info">Loading appointment status...</div>
      </div>
    );
  }

  if (protectedPage.isForbidden || error === 'Access denied') {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger">Access denied</div>
      </div>
    );
  }

  if (protectedPage.error || error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger">
          {protectedPage.error || error}
        </div>
      </div>
    );
  }

  return <VisitorAppointmentList appointments={appointments} />;
}
