'use client';

import { EmptyStateAlert } from '../../../components/common/StatusAlert';
import { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  VisitorAppointment,
} from '@features/appointments/types';
import styles from './VisitorAppointmentList.module.css';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';
import VisitorAppointmentCard from './VisitorAppointmentCard';

type VisitorAppointmentListProps = {
  appointments: VisitorAppointment[];
};

type BookingFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED';

const filters: Array<{ label: string; value: BookingFilter }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function VisitorAppointmentList({
  appointments,
}: VisitorAppointmentListProps) {
  const [filter, setFilter] = useState<BookingFilter>('ALL');
  const filteredAppointments = useMemo(
    () =>
      filter === 'ALL'
        ? appointments
        : appointments.filter((appointment) => appointment.status === filter),
    [appointments, filter],
  );
  const counts = useMemo(
    () => ({
      ALL: appointments.length,
      PENDING: appointments.filter((item) => item.status === 'PENDING').length,
      ACCEPTED: appointments.filter((item) => item.status === 'ACCEPTED').length,
      REJECTED: appointments.filter((item) => item.status === 'REJECTED').length,
    }),
    [appointments],
  );
  const emptyMessages = {
    ALL: 'You have not booked any appointments yet.',
    PENDING: 'You have no pending appointments.',
    ACCEPTED: 'You have no approved appointments.',
    REJECTED: 'You have no rejected appointments.',
  } as const;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">Appointments /</span> Status
      </h4>

      <div className="card">
        <h5 className="card-header">View Booking Status</h5>
        <div className="card-body">
          <div className={styles.toolbar}>
            {filters.map((item) => (
              <button
                className={`btn ${
                  filter === item.value ? 'btn-primary' : 'btn-outline-primary'
                }`}
                key={item.value}
                onClick={() => setFilter(item.value)}
                type="button"
              >
                <AnimatedButtonText>{item.label} ({counts[item.value]})</AnimatedButtonText>
              </button>
            ))}
            <Link href="/visitor/appointments/book" className="btn btn-success">
              Book Appointment
            </Link>
          </div>

          {filteredAppointments.length === 0 ? (
            <EmptyStateAlert className={styles.emptyState}>{emptyMessages[filter]}</EmptyStateAlert>
          ) : (
            <div className={styles.cards}>
              {filteredAppointments.map((appointment) => (
                <VisitorAppointmentCard appointment={appointment} key={appointment.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


