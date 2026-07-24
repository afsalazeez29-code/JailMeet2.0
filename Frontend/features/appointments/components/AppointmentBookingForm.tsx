'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { clearAccessToken } from '@features/auth/services/token.service';
import { createVisitorAppointment } from '@features/appointments/services/appointment.service';
import { isApiServiceError } from '@/types/api';
import { PrisonerOption } from '@features/appointments/types';
import styles from './AppointmentBookingForm.module.css';

type AppointmentBookingFormProps = {
  prisoners: PrisonerOption[];
};

const getDateInputValue = (date: Date): string =>
  date.toISOString().slice(0, 10);

export default function AppointmentBookingForm({
  prisoners,
}: AppointmentBookingFormProps) {
  const router = useRouter();
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return getDateInputValue(date);
  }, []);
  const [prisonerId, setPrisonerId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(tomorrow);
  const [appointmentTime, setAppointmentTime] = useState('10:00');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = (): string | null => {
    if (!prisonerId) {
      return 'Please select a prisoner';
    }

    const requestedDate = new Date(`${appointmentDate}T${appointmentTime}`);

    if (Number.isNaN(requestedDate.getTime()) || requestedDate <= new Date()) {
      return 'Appointment date and time must be in the future';
    }

    if (reason.trim().length < 5) {
      return 'Reason must be at least 5 characters';
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const appointmentAt = new Date(
        `${appointmentDate}T${appointmentTime}`,
      ).toISOString();

      await createVisitorAppointment({
        prisonerId,
        appointmentAt,
        reason: reason.trim(),
      });

      setSuccess('Appointment request submitted successfully.');
      setReason('');
      window.setTimeout(() => {
        router.push('/visitor/appointments');
      }, 800);
    } catch (caughtError) {
      if (isApiServiceError(caughtError)) {
        if (caughtError.status === 401) {
          clearAccessToken();
          router.replace('/login');
          return;
        }

        if (caughtError.status === 403) {
          setError('Access denied');
          return;
        }

        setError(caughtError.message || 'Unable to book appointment');
        return;
      }

      setError('Unable to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">Appointments /</span> Book
      </h4>

      <div className={`card mb-4 ${styles.formCard}`}>
        <h5 className="card-header">Book Appointment</h5>
        <div className="card-body">
          {success ? (
            <div className="alert alert-success" role="status">
              {success}{' '}
              <Link href="/visitor/appointments" className="alert-link">
                View booking status
              </Link>
            </div>
          ) : null}

          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          {prisoners.length === 0 ? (
            <div className="alert alert-warning">
              No prisoners are available for appointment booking yet.
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="prisonerId">
                Select Prisoner
              </label>
              <select
                className="form-select"
                disabled={submitting || prisoners.length === 0}
                id="prisonerId"
                onChange={(event) => setPrisonerId(event.target.value)}
                required
                value={prisonerId}
              >
                <option value="">Choose prisoner</option>
                {prisoners.map((prisoner) => (
                  <option key={prisoner.id} value={prisoner.id}>
                    {prisoner.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="form-label" htmlFor="appointmentDate">
                  Appointment Date
                </label>
                <input
                  className="form-control"
                  disabled={submitting}
                  id="appointmentDate"
                  min={tomorrow}
                  onChange={(event) => setAppointmentDate(event.target.value)}
                  required
                  type="date"
                  value={appointmentDate}
                />
              </div>

              <div className="mb-3 col-md-6">
                <label className="form-label" htmlFor="appointmentTime">
                  Appointment Time
                </label>
                <input
                  className="form-control"
                  disabled={submitting}
                  id="appointmentTime"
                  onChange={(event) => setAppointmentTime(event.target.value)}
                  required
                  type="time"
                  value={appointmentTime}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="reason">
                Reason
              </label>
              <textarea
                className="form-control"
                disabled={submitting}
                id="reason"
                maxLength={500}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Enter reason for appointment"
                required
                rows={4}
                value={reason}
              ></textarea>
              <div className={styles.helpText}>
                This request will be reviewed by an officer.
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className="btn btn-primary"
                disabled={submitting || prisoners.length === 0}
                type="submit"
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>
              <Link href="/visitor/appointments" className="btn btn-outline-secondary">
                View Booking Status
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
