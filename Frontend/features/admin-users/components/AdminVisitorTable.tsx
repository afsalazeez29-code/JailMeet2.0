'use client';

import { EmptyStateAlert } from '../../../components/common/StatusAlert';
import { AdminVisitor } from '@features/admin-users/types';
import { formatVisitorPublicId } from '@/lib/visitor-public-id';

type Props = {
  visitors: AdminVisitor[];
  onToggleStatus: (visitor: AdminVisitor) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));

export default function AdminVisitorTable({ onToggleStatus, visitors }: Props) {
  if (visitors.length === 0) return <EmptyStateAlert className="mb-0">No visitors found.</EmptyStateAlert>;
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead><tr><th>Visitor ID</th><th>Name</th><th>Email</th><th>Phone</th><th>State</th><th>Status</th><th>Created</th><th>Action</th></tr></thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor.id}>
              <td>{formatVisitorPublicId(visitor.publicId)}</td><td>{visitor.name}</td><td>{visitor.user.email}</td><td>{visitor.phone}</td><td>{visitor.state || 'N/A'}</td>
              <td><span className={`badge ${visitor.user.isActive ? 'badge-success' : 'badge-danger'}`}>{visitor.user.isActive ? 'Active' : 'Inactive'}</span></td>
              <td>{formatDate(visitor.createdAt)}</td>
              <td><button className="btn btn-warning btn-sm" onClick={() => onToggleStatus(visitor)} type="button">{visitor.user.isActive ? 'Deactivate' : 'Activate'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


