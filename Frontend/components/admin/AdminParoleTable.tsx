'use client';

import { AdminParoleRequest } from '@/types/admin';

type Props = { requests: AdminParoleRequest[] };

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function AdminParoleTable({ requests }: Props) {
  if (requests.length === 0) return <div className="alert alert-info mb-0">No parole requests found.</div>;
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead><tr><th>Prisoner</th><th>Relative</th><th>Relationship</th><th>Purpose</th><th>Dates</th><th>Status</th><th>Officer</th><th>Reply</th><th>Created</th></tr></thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.prisoner.name}</td><td>{request.relativeName}</td><td>{request.relationship}</td><td>{request.purpose}</td><td>{formatDate(request.fromDate)} to {formatDate(request.toDate)}</td><td>{request.status}</td><td>{request.officer?.name || 'Not reviewed'}</td><td>{request.officerReply || 'N/A'}</td><td>{formatDateTime(request.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
