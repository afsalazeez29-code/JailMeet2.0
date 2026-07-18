'use client';

import { useCallback, useEffect, useState } from 'react';

import { useProtectedPage } from '@/hooks/useProtectedPage';
import { getOfficerAppointments } from '@/services/appointment.service';
import { isApiServiceError } from '@/types/api';
import {
  AppointmentStatus,
  OfficerAppointment,
} from '@/types/appointment';

import OfficerAppointmentList from '../../../components/officer/OfficerAppointmentList';

export default function OfficerAppointmentsPage() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [filter, setFilter] = useState<AppointmentStatus | 'ALL'>('PENDING');
  const [appointments, setAppointments] = useState<OfficerAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getOfficerAppointments(
        filter === 'ALL' ? undefined : filter,
      );

      setAppointments(data);
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
          appointment.id === updatedAppointment.id
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
        <div className="alert alert-info">Loading appointment requests...</div>
      </div>
    );
  }

  if (protectedPage.isForbidden || error === 'Access denied') {
    return (
      <div className="pd-20">
        <div className="alert alert-danger">Access denied</div>
      </div>
    );
  }

  if (protectedPage.error || error) {
    return (
      <div className="pd-20">
        <div className="alert alert-danger">
          {protectedPage.error || error}
        </div>
      </div>
    );
  }

  return (
    <OfficerAppointmentList
      appointments={appointments}
      filter={filter}
      onFilterChange={setFilter}
      onReviewed={handleReviewed}
    />
  );
}
