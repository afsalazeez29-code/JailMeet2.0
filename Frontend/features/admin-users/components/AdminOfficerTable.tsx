'use client';

import Link from 'next/link';
import { AdminOfficer } from '@features/admin-users/types';

type Props = {
  officers: AdminOfficer[];
  onToggleStatus: (officer: AdminOfficer) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));

export default function AdminOfficerTable({ officers, onToggleStatus }: Props) {
  if (officers.length === 0) return <div className="alert alert-info mb-0">No officers found.</div>;
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Created</th><th>Action</th></tr></thead>
        <tbody>
          {officers.map((officer) => (
            <tr key={officer.id}>
              <td>{officer.name}</td><td>{officer.user.email}</td><td>{officer.phone || 'N/A'}</td>
              <td><span className={`badge ${officer.user.isActive ? 'badge-success' : 'badge-danger'}`}>{officer.user.isActive ? 'Active' : 'Inactive'}</span></td>
              <td>{formatDate(officer.createdAt)}</td>
              <td>
                <Link className="btn btn-info btn-sm mr-2" href={`/admin/officers/${officer.id}/edit`}>Edit</Link>
                <button className="btn btn-warning btn-sm" onClick={() => onToggleStatus(officer)} type="button">{officer.user.isActive ? 'Deactivate' : 'Activate'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
