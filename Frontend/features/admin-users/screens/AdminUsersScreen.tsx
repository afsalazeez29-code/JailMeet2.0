'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert, StatusAlert, SuccessAlert } from '../../../components/common/StatusAlert';
import { useEffect, useState } from 'react';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { clearAccessToken } from '@features/auth/services/token.service';
import {
  getAdminUsers,
  updateAdminUserStatus,
} from '@features/admin-users/services/admin-users.service';
import { isApiServiceError } from '@/types/api';
import {
  AdminAccountStatus,
  AdminUser,
  AdminUserRole,
  PaginatedResponse,
} from '@features/admin-users/types';

import AdminFilters from '../../../components/common/AdminFilters';
import AdminUserTable from '@features/admin-users/components/AdminUserTable';
import Pagination from '../../../components/common/Pagination';
import UserStatusModal from '@features/admin-users/components/UserStatusModal';

const roleOptions = [
  { label: 'All Roles', value: '' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Officer', value: 'OFFICER' },
  { label: 'Visitor', value: 'VISITOR' },
  { label: 'Prisoner', value: 'PRISONER' },
];

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

export default function AdminUsersPage() {
  const protectedPage = useProtectedPage();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalUser, setModalUser] = useState<AdminUser | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!protectedPage.isReady) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await getAdminUsers({
          search,
          page,
          limit: 20,
          role: role ? (role as AdminUserRole) : undefined,
          status: status ? (status as AdminAccountStatus) : undefined,
        });
        if (mounted) setData(users);
      } catch (caughtError) {
        if (!mounted) return;
        if (isApiServiceError(caughtError)) {
          if (caughtError.status === 401) {
            clearAccessToken();
            protectedPage.redirectToLogin();
            return;
          }
          setError(caughtError.status === 403 ? 'Access denied' : caughtError.message);
          return;
        }
        setError('Unable to load users');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [protectedPage.isReady, protectedPage.redirectToLogin, search, role, status, page]);

  const confirmStatusChange = async (user: AdminUser, reason: string, confirmation: string) => {
    setProcessing(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateAdminUserStatus(user.accountReference, {
        isActive: !user.isActive,
        reason,
        confirmation,
      });
      setData((current) =>
        current
          ? {
              ...current,
              items: current.items.map((item) =>
                item.accountReference === updated.accountReference ? updated : item,
              ),
            }
          : current,
      );
      setModalUser(null);
      setSuccess('User status updated successfully.');
    } catch (caughtError) {
      setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to update user status');
    } finally {
      setProcessing(false);
    }
  };

  if (protectedPage.isLoading || loading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) {
    return <AdminShell><LoadingAlert>Loading users...</LoadingAlert></AdminShell>;
  }

  if (protectedPage.isForbidden || error === 'Access denied') {
    return <AdminShell><ForbiddenAlert /></AdminShell>;
  }

  return (
    <AdminShell>
      <h3 className="fw-bold mb-3">Users</h3>
      {success ? <SuccessAlert>{success}</SuccessAlert> : null}
      {error || protectedPage.error ? <ErrorAlert>{error || protectedPage.error}</ErrorAlert> : null}
      <AdminFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        selects={[
          { label: 'Role', value: role, options: roleOptions, onChange: (value) => { setRole(value); setPage(1); } },
          { label: 'Status', value: status, options: statusOptions, onChange: (value) => { setStatus(value); setPage(1); } },
        ]}
      />
      <div className="card">
        <div className="card-body">
          <AdminUserTable
            users={data?.items ?? []}
            onSelectUser={setSelectedUser}
            onToggleStatus={setModalUser}
          />
          {data ? <Pagination pagination={data.pagination} onPageChange={setPage} /> : null}
        </div>
      </div>
      {selectedUser ? (
        <StatusAlert className="mt-3" variant="info">
          Selected: {selectedUser.name || selectedUser.email} ({selectedUser.role})
        </StatusAlert>
      ) : null}
      <UserStatusModal
        user={modalUser}
        processing={processing}
        onCancel={() => setModalUser(null)}
        onConfirm={confirmStatusChange}
      />
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container" style={{ position: 'absolute', top: '70px' }}>
      <div className="page-inner">{children}</div>
    </div>
  );
}






