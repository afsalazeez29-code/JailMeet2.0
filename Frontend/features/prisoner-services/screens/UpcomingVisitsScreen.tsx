'use client';

import { useEffect, useState } from 'react';
import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { getPrisonerUpcomingVisits } from '../services/prisoner-services.service';
import type { PrisonerVisit } from '../types';
import styles from '../components/PrisonerServices.module.css';

const dateTime = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function UpcomingVisitsScreen() {
  const auth = useProtectedPage();
  const [visits, setVisits] = useState<PrisonerVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isReady) return;
    let active = true; setLoading(true);
    getPrisonerUpcomingVisits().then((data) => { if (active) setVisits(data); }).catch((caught) => {
      if (active) setError(isApiServiceError(caught) ? caught.message : 'Unable to load upcoming visits.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [auth.isReady]);

  if (auth.isLoading || loading) return <div className={styles.page}><LoadingAlert>Loading upcoming visits…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  if (auth.error || error) return <div className={styles.page}><ErrorAlert>{auth.error || error}</ErrorAlert></div>;

  return <div className={styles.page}><h1 className={styles.heading}>Upcoming Visits</h1><p className={styles.subheading}>Approved future appointments involving you.</p>{!visits.length ? <EmptyStateAlert>No approved upcoming visits.</EmptyStateAlert> : <div className={styles.grid}>{visits.map((visit) => <article className={styles.card} key={visit.appointmentReference}><div className={styles.cardHeader}><div><h2>{visit.visitor.name}</h2><p className={styles.meta}>{visit.visitor.publicId || 'Visitor ID unavailable'} · {visit.appointmentReference}</p></div><span className={`${styles.status} ${styles.accepted}`}>Approved</span></div><dl className={styles.detailGrid}><div><dt>Visit date and time</dt><dd>{dateTime(visit.appointmentAt)}</dd></div><div><dt>Purpose</dt><dd>{visit.purpose}</dd></div><div><dt>Officer note</dt><dd>{visit.officerNote || 'No note provided'}</dd></div><div><dt>Booked</dt><dd>{dateTime(visit.createdAt)}</dd></div></dl></article>)}</div>}</div>;
}
