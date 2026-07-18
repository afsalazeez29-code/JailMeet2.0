'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  AppointmentStatus,
  VisitorAppointment,
} from '@/types/appointment';
import styles from './VisitorAppointmentList.module.css';

type VisitorAppointmentListProps = {
  appointments: VisitorAppointment[];
};

const filters: Array<{ label: string; value: AppointmentStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusClasses: Record<AppointmentStatus, string> = {
  PENDING: 'bg-label-warning',
  ACCEPTED: 'bg-label-success',
  REJECTED: 'bg-label-danger',
  COMPLETED: 'bg-label-primary',
  CANCELLED: 'bg-label-secondary',
};

const formatDateTime = (value: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function VisitorAppointmentList({
  appointments,
}: VisitorAppointmentListProps) {
  const [filter, setFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const filteredAppointments = useMemo(
    () =>
      filter === 'ALL'
        ? appointments
        : appointments.filter((appointment) => appointment.status === filter),
    [appointments, filter],
  );

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
                {item.label}
              </button>
            ))}
            <Link href="/visitor/appointments/book" className="btn btn-success">
              Book Appointment
            </Link>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className={`alert alert-info ${styles.emptyState}`}>
              No appointment requests found.
            </div>
          ) : (
            <div className="table-responsive text-nowrap">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Prisoner</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Officer Note</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
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
                      <td>{appointment.officerNote || 'Not reviewed yet'}</td>
                      <td>{formatDateTime(appointment.createdAt)}</td>
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
