'use client';

import { EmptyStateAlert, ErrorAlert } from '../../../components/common/StatusAlert';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { reviewAppointment } from '@features/appointments/services/appointment.service';
import { isApiServiceError } from '@/types/api';
import {
  AppointmentStatus,
  OfficerAppointment,
  ReviewAppointmentInput,
} from '@features/appointments/types';
import styles from './OfficerAppointmentList.module.css';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';

type OfficerAppointmentListProps = {
  appointments: OfficerAppointment[];
  filter: AppointmentStatus | 'ALL';
  onFilterChange: (status: AppointmentStatus | 'ALL') => void;
  onReviewed: (appointment: OfficerAppointment) => void;
};

const filters: Array<{ label: string; value: AppointmentStatus | 'ALL' }> = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'All', value: 'ALL' },
];

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusClasses: Record<AppointmentStatus, string> = {
  PENDING: 'badge-warning',
  ACCEPTED: 'badge-success',
  REJECTED: 'badge-danger',
  COMPLETED: 'badge-primary',
  CANCELLED: 'badge-secondary',
};

const formatDateTime = (value: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function OfficerAppointmentList({
  appointments,
  filter,
  onFilterChange,
  onReviewed,
}: OfficerAppointmentListProps) {
  const router = useRouter();
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleReview = async (
    appointmentId: string,
    status: ReviewAppointmentInput['status'],
  ) => {
    setReviewingId(appointmentId);
    setError(null);

    try {
      const updatedAppointment = await reviewAppointment(appointmentId, {
        status,
        officerNote: notes[appointmentId]?.trim() || undefined,
      });

      onReviewed(updatedAppointment);
    } catch (caughtError) {
      if (isApiServiceError(caughtError)) {
        if (caughtError.status === 401) {
          clearAccessToken();
          navigateToLogin(router);
          return;
        }

        if (caughtError.status === 403) {
          setError('Access denied');
          return;
        }

        setError(caughtError.message || 'Unable to review appointment');
        return;
      }

      setError('Unable to review appointment');
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="pd-20">
      <div className="card-box mb-30">
        <div className="pd-20">
          <h4 className="text-blue h4">Appointment Requests</h4>
          <p className="mb-0">Review visitor appointment booking requests.</p>
        </div>

        <div className="pd-20 pt-0">
          <div className={styles.toolbar}>
            {filters.map((item) => (
              <button
                className={`btn ${
                  filter === item.value ? 'btn-primary' : 'btn-outline-primary'
                }`}
                key={item.value}
                onClick={() => onFilterChange(item.value)}
                type="button"
              >
                <AnimatedButtonText>{item.label}</AnimatedButtonText>
              </button>
            ))}
          </div>

          {error ? (
            <ErrorAlert role="alert">{error}</ErrorAlert>
          ) : null}

          {appointments.length === 0 ? (
            <EmptyStateAlert className="mb-0">No appointment requests found.</EmptyStateAlert>
          ) : (
            <div className="table-responsive">
              <table className="data-table table stripe hover nowrap">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Phone</th>
                    <th>Prisoner</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Officer Note</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.visitor.name}</td>
                      <td>{appointment.visitor.phone}</td>
                      <td>{appointment.prisoner.name}</td>
                      <td>{formatDateTime(appointment.appointmentAt)}</td>
                      <td>{appointment.reason}</td>
                      <td>
                        <span
                          className={`badge ${statusClasses[appointment.status]} ${styles.statusBadge}`}
                        >
                          {statusLabels[appointment.status]}
                        </span>
                      </td>
                      <td>
                        {appointment.status === 'PENDING' ? (
                          <input
                            className={`form-control ${styles.noteField}`}
                            disabled={reviewingId === appointment.id}
                            maxLength={500}
                            onChange={(event) =>
                              setNotes((currentNotes) => ({
                                ...currentNotes,
                                [appointment.id]: event.target.value,
                              }))
                            }
                            placeholder="Optional note"
                            type="text"
                            value={notes[appointment.id] ?? ''}
                          />
                        ) : (
                          appointment.officerNote || 'No note'
                        )}
                      </td>
                      <td>{formatDateTime(appointment.createdAt)}</td>
                      <td>
                        {appointment.status === 'PENDING' ? (
                          <div className={styles.actions}>
                            <button
                              className="btn btn-success btn-sm"
                              disabled={reviewingId === appointment.id}
                              onClick={() =>
                                void handleReview(appointment.id, 'ACCEPTED')
                              }
                              type="button"
                            >
                              {reviewingId === appointment.id
                                ? 'Processing...'
                                : 'Approve'}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={reviewingId === appointment.id}
                              onClick={() =>
                                void handleReview(appointment.id, 'REJECTED')
                              }
                              type="button"
                            >
                              {reviewingId === appointment.id
                                ? 'Processing...'
                                : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          'Reviewed'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



