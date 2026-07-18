'use client';

import { useEffect, useState } from 'react';
import { useProtectedPage } from '@/hooks/useProtectedPage';
import { clearAccessToken } from '@/lib/auth';
import { getAdminParoleRequests } from '@/services/admin.service';
import { isApiServiceError } from '@/types/api';
import { AdminParoleRequest, PaginatedResponse } from '@/types/admin';
import { ParoleStatus } from '@/types/parole';
import AdminFilters from '../../../components/admin/AdminFilters';
import AdminParoleTable from '../../../components/admin/AdminParoleTable';
import Pagination from '../../../components/admin/Pagination';

const statusOptions = [
  { label: 'All Statuses', value: '' }, { label: 'Pending', value: 'PENDING' }, { label: 'Approved', value: 'ACCEPTED' }, { label: 'Rejected', value: 'REJECTED' },
];

export default function AdminParolePage() {
  const protectedPage = useProtectedPage();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<AdminParoleRequest> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setStatus(new URLSearchParams(window.location.search).get('status') ?? '');
  }, []);
  useEffect(() => {
    if (!protectedPage.isReady) return; let mounted = true;
    const load = async () => { setLoading(true); setError(null); try { const requests = await getAdminParoleRequests({ page, limit: 20, status: status ? status as ParoleStatus : undefined }); if (mounted) setData(requests); } catch (caughtError) { if (!mounted) return; if (isApiServiceError(caughtError)) { if (caughtError.status === 401) { clearAccessToken(); protectedPage.redirectToLogin(); return; } setError(caughtError.status === 403 ? 'Access denied' : caughtError.message); return; } setError('Unable to load parole requests'); } finally { if (mounted) setLoading(false); } };
    void load(); return () => { mounted = false; };
  }, [protectedPage.isReady, protectedPage.redirectToLogin, status, page]);
  if (protectedPage.isLoading || loading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><div className="alert alert-info">Loading parole requests...</div></Shell>;
  if (protectedPage.isForbidden || error === 'Access denied') return <Shell><div className="alert alert-danger">Access denied</div></Shell>;
  return <Shell><h3 className="fw-bold mb-3">Parole Requests</h3>{error || protectedPage.error ? <div className="alert alert-danger">{error || protectedPage.error}</div> : null}<AdminFilters search="" onSearchChange={() => undefined} selects={[{ label: 'Status', value: status, options: statusOptions, onChange: (value) => { setStatus(value); setPage(1); } }]} /><div className="card"><div className="card-body"><AdminParoleTable requests={data?.items ?? []} />{data ? <Pagination pagination={data.pagination} onPageChange={setPage} /> : null}</div></div></Shell>;
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>; }
