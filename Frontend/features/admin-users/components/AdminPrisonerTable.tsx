'use client';

import { EmptyStateAlert } from '../../../components/common/StatusAlert';
import Link from 'next/link';
import { AdminPrisoner } from '@features/admin-users/types';

type Props = {
  prisoners: AdminPrisoner[];
  onToggleStatus: (prisoner: AdminPrisoner) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));

export default function AdminPrisonerTable({ onToggleStatus, prisoners }: Props) {
  if (prisoners.length === 0) return <EmptyStateAlert className="mb-0">No prisoners found.</EmptyStateAlert>;
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead><tr><th>Name</th><th>Public ID</th><th>Email</th><th>Assigned Officer</th><th>Age</th><th>Gender</th><th>Jail</th><th>Cell</th><th>Status</th><th>Created</th><th>Action</th></tr></thead>
        <tbody>
          {prisoners.map((prisoner) => (
            <tr key={prisoner.publicId ?? prisoner.user.email ?? prisoner.name}>
              <td>{prisoner.name}</td><td>{prisoner.publicId || 'ID unavailable'}</td><td>{prisoner.user.email}</td><td>{prisoner.assignedOfficer ? `${prisoner.assignedOfficer.name} (${prisoner.assignedOfficer.publicId || 'ID unavailable'})` : 'Unassigned'}</td><td>{prisoner.age}</td><td>{prisoner.gender}</td><td>{prisoner.jailName || 'N/A'}</td><td>{prisoner.cellNumber || 'N/A'}</td>
              <td><span className={`badge ${prisoner.user.isActive ? 'badge-success' : 'badge-danger'}`}>{prisoner.user.isActive ? 'Active' : 'Inactive'}</span></td>
              <td>{formatDate(prisoner.createdAt)}</td>
              <td>
                {prisoner.publicId ? <><Link className="btn btn-info btn-sm mr-2" href={`/admin/prisoners/${prisoner.publicId}`}>View</Link><Link className="btn btn-outline-info btn-sm mr-2" href={`/admin/prisoners/${prisoner.publicId}/edit`}>Edit</Link></> : null}
                <button className="btn btn-warning btn-sm" onClick={() => onToggleStatus(prisoner)} type="button">{prisoner.user.isActive ? 'Deactivate' : 'Activate'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


