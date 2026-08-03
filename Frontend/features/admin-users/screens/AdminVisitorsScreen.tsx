'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import { useEffect, useState } from 'react';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { clearAccessToken } from '@features/auth/services/token.service';
import { getAdminVisitors, updateAdminUserStatus } from '@features/admin-users/services/admin-users.service';
import { isApiServiceError } from '@/types/api';
import { AdminUser, AdminVisitor, PaginatedResponse } from '@features/admin-users/types';
import AdminFilters from '../../../components/common/AdminFilters';
import AdminVisitorTable from '@features/admin-users/components/AdminVisitorTable';
import Pagination from '../../../components/common/Pagination';
import UserStatusModal from '@features/admin-users/components/UserStatusModal';

export default function AdminVisitorsPage() {
  const protectedPage = useProtectedPage();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<AdminVisitor> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<AdminUser | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!protectedPage.isReady) return;
    let mounted = true;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const visitors = await getAdminVisitors({ search, page, limit: 20 });
        if (mounted) setData(visitors);
      } catch (caughtError) {
        if (!mounted) return;
        if (isApiServiceError(caughtError)) {
          if (caughtError.status === 401) { clearAccessToken(); protectedPage.redirectToLogin(); return; }
          setError(caughtError.status === 403 ? 'Access denied' : caughtError.message); return;
        }
        setError('Unable to load visitors');
      } finally { if (mounted) setLoading(false); }
    };
    void load();
    return () => { mounted = false; };
  }, [protectedPage.isReady, protectedPage.redirectToLogin, search, page]);

  const toUser = (visitor: AdminVisitor): AdminUser => ({
    accountReference: visitor.publicId ?? visitor.user.email ?? '', publicId: visitor.publicId, name: visitor.name, email: visitor.user.email, role: 'VISITOR', isActive: visitor.user.isActive, createdAt: visitor.createdAt, updatedAt: visitor.updatedAt,
  });

  const confirm = async (user: AdminUser, reason: string, confirmation: string) => {
    setProcessing(true);
    try {
      const updated = await updateAdminUserStatus(user.accountReference, { isActive: !user.isActive, reason, confirmation });
      setData((current) => current ? { ...current, items: current.items.map((item) => (item.publicId ?? item.user.email) === updated.accountReference ? { ...item, user: { ...item.user, isActive: updated.isActive } } : item) } : current);
      setModalUser(null);
    } catch (caughtError) {
      setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to update status');
    } finally { setProcessing(false); }
  };

  if (protectedPage.isLoading || loading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><LoadingAlert>Loading visitors...</LoadingAlert></Shell>;
  if (protectedPage.isForbidden || error === 'Access denied') return <Shell><ForbiddenAlert /></Shell>;

  return <Shell><h3 className="fw-bold mb-3">Visitors</h3>{error || protectedPage.error ? <ErrorAlert>{error || protectedPage.error}</ErrorAlert> : null}<AdminFilters search={search} onSearchChange={(value) => { setSearch(value); setPage(1); }} /><div className="card"><div className="card-body"><AdminVisitorTable visitors={data?.items ?? []} onToggleStatus={(visitor) => setModalUser(toUser(visitor))} />{data ? <Pagination pagination={data.pagination} onPageChange={setPage} /> : null}</div></div><UserStatusModal user={modalUser} processing={processing} onCancel={() => setModalUser(null)} onConfirm={confirm} /></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>;
}


