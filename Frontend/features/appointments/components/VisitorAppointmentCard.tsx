'use client';

import { FormEvent, useState } from 'react';

import { isApiServiceError } from '@/types/api';
import type { VisitorAppointment } from '@features/appointments/types';
import {
  submitCancellationRequest,
  submitRescheduleRequest,
} from '@features/visitor-services/services/visitor-services.service';

import styles from './VisitorAppointmentCard.module.css';

const DEFAULT_PRISONER_AVATAR = '/images/avatars/prisoner-default.PNG';

const statusLabels = {
  PENDING: 'Pending',
  ACCEPTED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

const formatDateTime = (value: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const statusMessage = (appointment: VisitorAppointment): string => {
  if (appointment.status === 'ACCEPTED') {
    return `Your appointment to see ${appointment.prisoner.name} has been approved.`;
  }
  if (appointment.status === 'REJECTED') {
    return `Your appointment to see ${appointment.prisoner.name} was rejected.`;
  }
  return `You booked an appointment to see ${appointment.prisoner.name}.`;
};

export default function VisitorAppointmentCard({
  appointment,
  compact = false,
}: {
  appointment: VisitorAppointment;
  compact?: boolean;
}) {
  const note = appointment.officerNote?.trim();
  const [action, setAction] = useState<'CANCEL' | 'RESCHEDULE' | null>(null);
  const [reason, setReason] = useState('');
  const [requestedAt, setRequestedAt] = useState('');
  const [cancellationConfirmed, setCancellationConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const eligible =
    !compact &&
    !requestSubmitted &&
    !appointment.hasPendingChangeRequest &&
    new Date(appointment.appointmentAt) > new Date() &&
    (appointment.status === 'PENDING' || appointment.status === 'ACCEPTED');

  const submitRequest = async (event: FormEvent) => {
    event.preventDefault();
    if (!action) return;
    setSubmitting(true); setRequestError(null);
    try {
      if (action === 'CANCEL') await submitCancellationRequest(appointment.id, reason);
      else await submitRescheduleRequest(appointment.id, new Date(requestedAt).toISOString(), reason);
      setRequestSubmitted(true); setAction(null); setReason(''); setRequestedAt(''); setCancellationConfirmed(false);
    } catch (caught) {
      setRequestError(isApiServiceError(caught) ? caught.message : 'Unable to submit request');
    } finally { setSubmitting(false); }
  };

  return (
    <article className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.main}>
        <img
          alt={`${appointment.prisoner.name} profile picture`}
          className={styles.avatar}
          height={72}
          loading="lazy"
          src={appointment.prisoner.profilePic || DEFAULT_PRISONER_AVATAR}
          width={72}
        />
        <div className={styles.content}>
          <h3>{statusMessage(appointment)}</h3>
          <p className={styles.prisonerId}>{appointment.prisoner.publicId}</p>
          <dl className={styles.details}>
            <div><dt>Appointment</dt><dd>{formatDateTime(appointment.appointmentAt)}</dd></div>
            <div><dt>Purpose</dt><dd>{appointment.reason}</dd></div>
            {!compact ? <div><dt>Booked</dt><dd>{formatDateTime(appointment.createdAt)}</dd></div> : null}
            {appointment.status === 'PENDING' ? (
              <div><dt>Review</dt><dd>Waiting for Officer review.</dd></div>
            ) : null}
            {appointment.status === 'ACCEPTED' && note ? (
              <div><dt>Officer instructions</dt><dd>{note}</dd></div>
            ) : null}
            {appointment.status === 'REJECTED' ? (
              <div><dt>Reason</dt><dd>{note || 'No additional reason was provided.'}</dd></div>
            ) : null}
          </dl>
        </div>
      </div>
      <span className={`${styles.status} ${styles[appointment.status.toLowerCase()]}`}>
        {statusLabels[appointment.status]}
      </span>
      {eligible ? <div className={styles.changeActions}>
        <button className="btn btn-outline-danger btn-sm" onClick={() => setAction('CANCEL')} type="button">Request Cancellation</button>
        <button className="btn btn-outline-primary btn-sm" onClick={() => setAction('RESCHEDULE')} type="button">Request Reschedule</button>
      </div> : null}
      {appointment.hasPendingChangeRequest && !compact ? <p className={styles.requestSuccess} role="status">A change request is pending Officer review.</p> : null}
      {requestSubmitted ? <p className={styles.requestSuccess} role="status">Your change request was submitted for Officer review.</p> : null}
      {action ? <form className={styles.requestForm} onSubmit={submitRequest}>
        <h4>{action === 'CANCEL' ? 'Cancellation request' : 'Reschedule request'}</h4>
        {action === 'RESCHEDULE' ? <label>Requested date and time<input min={new Date(Date.now() + 60000).toISOString().slice(0, 16)} onChange={(event) => setRequestedAt(event.target.value)} required type="datetime-local" value={requestedAt} /></label> : null}
        <label>Reason<textarea maxLength={500} minLength={5} onChange={(event) => setReason(event.target.value)} required value={reason} /></label>
        {action === 'CANCEL' ? <label className={styles.confirmation}><input checked={cancellationConfirmed} onChange={(event) => setCancellationConfirmed(event.target.checked)} required type="checkbox" /> I confirm that I want to request cancellation of this appointment.</label> : null}
        {requestError ? <p className={styles.requestError} role="alert">{requestError}</p> : null}
        <div className={styles.changeActions}><button className="btn btn-primary btn-sm" disabled={submitting || (action === 'CANCEL' && !cancellationConfirmed)} type="submit">{submitting ? 'Submitting…' : 'Confirm Request'}</button><button className="btn btn-outline-secondary btn-sm" disabled={submitting} onClick={() => { setAction(null); setCancellationConfirmed(false); }} type="button">Close</button></div>
      </form> : null}
    </article>
  );
}
