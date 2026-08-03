'use client';

import { useCallback, useEffect, useState } from 'react';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getOfficerAppointments } from '@features/appointments/services/appointment.service';
import { isApiServiceError } from '@/types/api';
import {
  AppointmentStatus,
  OfficerAppointment,
} from '@features/appointments/types';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';

import OfficerAppointmentList from '@features/appointments/components/OfficerAppointmentList';
import OfficerVisitorTools from '@features/visitor-services/components/OfficerVisitorTools';

export default function OfficerAppointmentsPage() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [filter, setFilter] = useState<AppointmentStatus | 'ALL'>(() => {
    if (typeof window === 'undefined') return 'PENDING';
    const value = new URLSearchParams(window.location.search).get('status');
    return ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'].includes(value || '') ? value as AppointmentStatus | 'ALL' : 'PENDING';
  });
  const [appointments, setAppointments] = useState<OfficerAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getOfficerAppointments(filter);

      setAppointments(data.items);
    } catch (caughtError) {
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
      setLoading(false);
    }
  }, [filter, redirectToLogin]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void loadAppointments();
  }, [isReady, loadAppointments]);

  const handleReviewed = (updatedAppointment: OfficerAppointment) => {
    setAppointments((currentAppointments) =>
      currentAppointments
        .map((appointment) =>
          appointment.reference === updatedAppointment.reference
            ? updatedAppointment
            : appointment,
        )
        .filter((appointment) =>
          filter === 'ALL' ? true : appointment.status === filter,
        ),
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
        <LoadingAlert>Loading appointment requests...</LoadingAlert>
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

  return (
    <>
      <OfficerAppointmentList
        appointments={appointments}
        filter={filter}
        onFilterChange={setFilter}
        onReviewed={handleReviewed}
        onRefresh={() => void loadAppointments()}
      />
      <OfficerVisitorTools />
    </>
  );
}



