'use client';

import { useEffect, useState } from 'react';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getAvailablePrisoners } from '@features/appointments/services/appointment.service';
import { isApiServiceError } from '@/types/api';
import { PrisonerOption } from '@features/appointments/types';
import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';

import AppointmentBookingForm from '@features/appointments/components/AppointmentBookingForm';

export default function VisitorAppointmentBookingPage() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [prisoners, setPrisoners] = useState<PrisonerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let isMounted = true;

    const loadPrisoners = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAvailablePrisoners();

        if (isMounted) {
          setPrisoners(data);
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

          setError(caughtError.message || 'Unable to load prisoners');
          return;
        }

        setError('Unable to load prisoners');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadPrisoners();

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
        <LoadingAlert>Loading appointment form...</LoadingAlert>
      </div>
    );
  }

  if (protectedPage.isForbidden || error === 'Access denied') {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ForbiddenAlert />
      </div>
    );
  }

  if (protectedPage.error || error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ErrorAlert>{protectedPage.error || error}</ErrorAlert>
      </div>
    );
  }

  return <AppointmentBookingForm prisoners={prisoners} />;
}



