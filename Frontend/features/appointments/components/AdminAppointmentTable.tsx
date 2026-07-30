'use client';

import { EmptyStateAlert } from '../../../components/common/StatusAlert';
import { AdminAppointment } from '@features/appointments/types';
import { formatVisitorPublicId } from '@/lib/visitor-public-id';

type Props = { appointments: AdminAppointment[] };

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function AdminAppointmentTable({ appointments }: Props) {
  if (appointments.length === 0) return <EmptyStateAlert className="mb-0">No appointments found.</EmptyStateAlert>;
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead><tr><th>Visitor</th><th>Prisoner</th><th>Requested</th><th>Relationship</th><th>Message</th><th>Status</th><th>Officer</th><th>Reply</th><th>Created</th></tr></thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.visitor.name}<small className="d-block text-muted">{formatVisitorPublicId(appointment.visitor.publicId)}</small></td><td>{appointment.prisoner.name}</td><td>{formatDateTime(appointment.requestedDate)}</td><td>{appointment.relationship}</td><td>{appointment.message || 'N/A'}</td><td>{appointment.status}</td><td>{appointment.officer?.name || 'Not reviewed'}</td><td>{appointment.replyMessage || 'N/A'}</td><td>{formatDateTime(appointment.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


