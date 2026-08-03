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
        <thead><tr><th>Reference</th><th>Visitor</th><th>Prisoner</th><th>Requested</th><th>Purpose</th><th>Status</th><th>Reviewer</th><th>VisitPass</th><th>Change outcome</th><th>Reply</th></tr></thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.reference}>
              <td>{appointment.reference}</td><td>{appointment.visitor.name}<small className="d-block text-muted">{formatVisitorPublicId(appointment.visitor.publicId)}</small></td><td>{appointment.prisoner.name}<small className="d-block text-muted">{appointment.prisoner.publicId||'ID unavailable'}</small></td><td>{formatDateTime(appointment.requestedDate)}</td><td>{appointment.message || appointment.relationship}</td><td>{appointment.status}</td><td>{appointment.officer ? `${appointment.officer.name} (${appointment.officer.publicId||'ID unavailable'})` : 'Not reviewed'}</td><td>{appointment.visitPass?.status||'Not issued'}{appointment.visitPass?.checkedInAt?<small className="d-block">Checked in {formatDateTime(appointment.visitPass.checkedInAt)}</small>:null}</td><td>{appointment.changeRequests[0]?`${appointment.changeRequests[0].reference}: ${appointment.changeRequests[0].status}`:'None'}</td><td>{appointment.replyMessage || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


