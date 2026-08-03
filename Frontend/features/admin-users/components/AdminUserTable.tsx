'use client';

import { EmptyStateAlert } from '../../../components/common/StatusAlert';
import { AdminUser } from '@features/admin-users/types';
import Link from 'next/link';

type AdminUserTableProps = {
  users: AdminUser[];
  onSelectUser: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
};

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(
    new Date(value),
  );

export default function AdminUserTable({
  onSelectUser,
  onToggleStatus,
  users,
}: AdminUserTableProps) {
  if (users.length === 0) {
    return <EmptyStateAlert className="mb-0">No users found.</EmptyStateAlert>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.accountReference}>
              <td>{user.name || 'Not provided'}</td>
              <td>{user.email || 'No email'}</td>
              <td>{user.role}</td>
              <td>
                <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <Link className="btn btn-info btn-sm mr-2" href={`/admin/users/${encodeURIComponent(user.accountReference)}`} onClick={() => onSelectUser(user)}>View</Link>
                <button className="btn btn-warning btn-sm" onClick={() => onToggleStatus(user)} type="button">
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


