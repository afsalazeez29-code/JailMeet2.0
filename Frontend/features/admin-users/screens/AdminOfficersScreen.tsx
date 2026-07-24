'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { clearAccessToken } from '@features/auth/services/token.service';
import { getAdminOfficers, updateAdminUserStatus } from '@features/admin-users/services/admin-users.service';
import { isApiServiceError } from '@/types/api';
import { AdminOfficer, AdminUser, PaginatedResponse } from '@features/admin-users/types';
import AdminFilters from '../../../components/common/AdminFilters';
import AdminOfficerTable from '@features/admin-users/components/AdminOfficerTable';
import Pagination from '../../../components/common/Pagination';
import UserStatusModal from '@features/admin-users/components/UserStatusModal';

export default function AdminOfficersPage() {
  const protectedPage = useProtectedPage();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<AdminOfficer> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<AdminUser | null>(null);
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    if (!protectedPage.isReady) return; let mounted = true;
    const load = async () => { setLoading(true); setError(null); try { const officers = await getAdminOfficers({ search, page, limit: 20 }); if (mounted) setData(officers); } catch (caughtError) { if (!mounted) return; if (isApiServiceError(caughtError)) { if (caughtError.status === 401) { clearAccessToken(); protectedPage.redirectToLogin(); return; } setError(caughtError.status === 403 ? 'Access denied' : caughtError.message); return; } setError('Unable to load officers'); } finally { if (mounted) setLoading(false); } };
    void load(); return () => { mounted = false; };
  }, [protectedPage.isReady, protectedPage.redirectToLogin, search, page]);
  const toUser = (officer: AdminOfficer): AdminUser => ({ id: officer.user.id, name: officer.name, email: officer.user.email, role: 'OFFICER', isActive: officer.user.isActive, createdAt: officer.createdAt, updatedAt: officer.updatedAt });
  const confirm = async (user: AdminUser) => { setProcessing(true); try { const updated = await updateAdminUserStatus(user.id, { isActive: !user.isActive }); setData((current) => current ? { ...current, items: current.items.map((item) => item.user.id === updated.id ? { ...item, user: { ...item.user, isActive: updated.isActive } } : item) } : current); setModalUser(null); } catch (caughtError) { setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to update status'); } finally { setProcessing(false); } };
  if (protectedPage.isLoading || loading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><div className="alert alert-info">Loading officers...</div></Shell>;
  if (protectedPage.isForbidden || error === 'Access denied') return <Shell><div className="alert alert-danger">Access denied</div></Shell>;
  return <Shell><div className="d-flex justify-content-between align-items-center mb-3"><h3 className="fw-bold mb-0">Officers</h3><Link className="btn btn-primary" href="/admin/officers/new">Add Officer</Link></div>{error || protectedPage.error ? <div className="alert alert-danger">{error || protectedPage.error}</div> : null}<AdminFilters search={search} onSearchChange={(value) => { setSearch(value); setPage(1); }} /><div className="card"><div className="card-body"><AdminOfficerTable officers={data?.items ?? []} onToggleStatus={(officer) => setModalUser(toUser(officer))} />{data ? <Pagination pagination={data.pagination} onPageChange={setPage} /> : null}</div></div><UserStatusModal user={modalUser} processing={processing} onCancel={() => setModalUser(null)} onConfirm={confirm} /></Shell>;
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>; }
