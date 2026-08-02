'use client';

import { useCallback, useEffect, useState } from 'react';
import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { getPrisonerVisitHistory } from '../services/prisoner-services.service';
import type { PrisonerVisitHistoryPage } from '../types';
import styles from '../components/PrisonerServices.module.css';

type Filter = '' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
const dateTime = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function PrisonerVisitHistoryScreen() {
  const auth = useProtectedPage();
  const [data, setData] = useState<PrisonerVisitHistoryPage | null>(null);
  const [filter, setFilter] = useState<Filter>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { setLoading(true); setError(null); try { setData(await getPrisonerVisitHistory(filter || undefined, page)); } catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to load visit history.'); } finally { setLoading(false); } }, [filter, page]);
  useEffect(() => { if (auth.isReady) void load(); }, [auth.isReady, load]);
  if (auth.isLoading || (loading && !data)) return <div className={styles.page}><LoadingAlert>Loading visitor history…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  if (auth.error || error) return <div className={styles.page}><ErrorAlert>{auth.error || error}</ErrorAlert></div>;
  return <div className={styles.page}><h1 className={styles.heading}>Visitors History</h1><p className={styles.subheading}>Completed, cancelled, and expired appointments involving you.</p><div className={styles.filters} role="group" aria-label="Filter visit history">{(['', 'COMPLETED', 'CANCELLED', 'EXPIRED'] as Filter[]).map((value) => <button className={`btn ${filter === value ? 'btn-primary' : 'btn-outline-secondary'}`} key={value || 'ALL'} onClick={() => { setFilter(value); setPage(1); }} type="button">{value || 'ALL'}</button>)}</div>{!data?.items.length ? <EmptyStateAlert>No visits match this filter.</EmptyStateAlert> : <div className={styles.grid}>{data.items.map((visit) => <article className={styles.card} key={visit.appointmentReference}><div className={styles.cardHeader}><div><h2>{visit.visitor.name}</h2><p className={styles.meta}>{visit.visitor.publicId || 'Visitor ID unavailable'} · {visit.appointmentReference}</p></div><span className={`${styles.status} ${styles[visit.status.toLowerCase() as 'completed'] || ''}`}>{visit.status}</span></div><dl className={styles.detailGrid}><div><dt>Visit date and time</dt><dd>{dateTime(visit.appointmentAt)}</dd></div><div><dt>Purpose</dt><dd>{visit.purpose}</dd></div><div><dt>Officer note</dt><dd>{visit.officerNote || 'No note provided'}</dd></div><div><dt>Last updated</dt><dd>{dateTime(visit.updatedAt)}</dd></div></dl></article>)}</div>}{data && data.pagination.totalPages > 1 ? <div className={styles.actions}><button className="btn btn-outline-secondary" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} type="button">Previous</button><span>Page {page} of {data.pagination.totalPages}</span><button className="btn btn-outline-secondary" disabled={page >= data.pagination.totalPages || loading} onClick={() => setPage((value) => value + 1)} type="button">Next</button></div> : null}</div>;
}
