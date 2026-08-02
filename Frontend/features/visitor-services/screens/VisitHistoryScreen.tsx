'use client';

import { useCallback, useEffect, useState } from 'react';

import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { getVisitHistory } from '../services/visitor-services.service';
import type { VisitHistoryItem } from '../types';
import styles from '../components/VisitorServices.module.css';

const fallback = '/images/avatars/prisoner-default.PNG';
const filters = ['ALL', 'COMPLETED', 'CANCELLED', 'REJECTED', 'EXPIRED'] as const;
const format = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function VisitHistoryScreen() {
  const auth = useProtectedPage();
  const [filter, setFilter] = useState<(typeof filters)[number]>('ALL');
  const [items, setItems] = useState<VisitHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getVisitHistory(filter === 'ALL' ? undefined : filter, page);
      setItems(data.items); setPages(data.pagination.totalPages);
    } catch (caught) {
      if (isApiServiceError(caught) && caught.status === 401) auth.redirectToLogin();
      else setError(isApiServiceError(caught) ? caught.message : 'Unable to load visit history');
    } finally { setLoading(false); }
  }, [auth.redirectToLogin, filter, page]);

  useEffect(() => { if (auth.isReady) void load(); }, [auth.isReady, load]);

  if (auth.isLoading || (loading && !items.length)) return <div className={styles.page}><LoadingAlert>Loading visit history…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  if (auth.error || error) return <div className={styles.page}><ErrorAlert>{auth.error || error}</ErrorAlert></div>;

  return <div className={styles.page}>
    <h1 className={styles.heading}>Visit History</h1>
    <p className={styles.subheading}>Completed visits and closed appointment outcomes.</p>
    <div className={styles.filters}>{filters.map((value) => <button className={`btn ${filter === value ? 'btn-primary' : 'btn-outline-primary'}`} key={value} onClick={() => { setFilter(value); setPage(1); }} type="button">{value === 'ALL' ? 'All' : value[0] + value.slice(1).toLowerCase()}</button>)}</div>
    {!items.length ? <EmptyStateAlert className={styles.empty}>No matching history records.</EmptyStateAlert> : <div className={styles.grid}>{items.map((item, index) => {
      const outcome = item.passStatus === 'EXPIRED' ? 'EXPIRED' : item.appointmentStatus;
      return <article className={styles.card} key={`${item.appointmentAt}-${index}`}>
        <div className={styles.cardHeader}><div className={styles.identity}><img alt={`${item.prisoner.name} profile`} className={styles.avatar} src={item.prisoner.profilePic || fallback} /><div><h2>{item.prisoner.name}</h2><p className={styles.muted}>{item.prisoner.publicId}</p></div></div><span className={`${styles.status} ${styles[outcome.toLowerCase()]}`}>{outcome}</span></div>
        <dl className={styles.details}>
          <div><dt>Appointment</dt><dd>{format(item.appointmentAt)}</dd></div><div><dt>Purpose</dt><dd>{item.purpose}</dd></div><div><dt>Booked</dt><dd>{format(item.bookedAt)}</dd></div>
          {item.passStatus ? <div><dt>Pass status</dt><dd>{item.passStatus}</dd></div> : null}{item.checkedInAt ? <div><dt>Check-in</dt><dd>{format(item.checkedInAt)}</dd></div> : null}
          {item.officerNote ? <div><dt>Officer reply</dt><dd>{item.officerNote}</dd></div> : null}{item.changeOutcome ? <div><dt>Change request</dt><dd>{item.changeOutcome.requestType} · {item.changeOutcome.status}{item.changeOutcome.officerReply ? ` — ${item.changeOutcome.officerReply}` : ''}</dd></div> : null}
        </dl>
      </article>;
    })}</div>}
    {pages > 1 ? <div className={styles.pagination}><button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage((value) => value - 1)} type="button">Previous</button><span>Page {page} of {pages}</span><button className="btn btn-outline-primary" disabled={page === pages} onClick={() => setPage((value) => value + 1)} type="button">Next</button></div> : null}
  </div>;
}
