'use client';

import { EmptyStateAlert } from '../../../components/common/StatusAlert';
import { AdminParoleRequest } from '@features/parole/types';

type Props = { requests: AdminParoleRequest[] };

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function AdminParoleTable({ requests }: Props) {
  if (requests.length === 0) return <EmptyStateAlert className="mb-0">No parole requests found.</EmptyStateAlert>;
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead><tr><th>Reference</th><th>Prisoner</th><th>Assigned Officer</th><th>Relative</th><th>Purpose</th><th>Dates</th><th>Status</th><th>Reviewer</th><th>Reply</th><th>Submitted</th></tr></thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.reference}>
              <td>{request.reference}</td><td>{request.prisoner.name}<small className="d-block text-muted">{request.prisoner.publicId||'ID unavailable'}</small></td><td>{request.prisoner.assignedOfficer?`${request.prisoner.assignedOfficer.name} (${request.prisoner.assignedOfficer.publicId||'ID unavailable'})`:'Unassigned'}</td><td>{request.relativeName} ({request.relationship})</td><td>{request.purpose}</td><td>{formatDate(request.fromDate)} to {formatDate(request.toDate)}</td><td>{request.status}</td><td>{request.officer?`${request.officer.name} (${request.officer.publicId||'ID unavailable'})`:'Not reviewed'}</td><td>{request.officerReply || 'N/A'}</td><td>{formatDateTime(request.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


