import type { VisitorAppointment } from '@features/appointments/types';

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
    </article>
  );
}
