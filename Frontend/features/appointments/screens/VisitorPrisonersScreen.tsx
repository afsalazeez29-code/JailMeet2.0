'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert, EmptyStateAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getAvailablePrisoners } from '@features/appointments/services/appointment.service';
import type { PrisonerOption } from '@features/appointments/types';
import { isApiServiceError } from '@/types/api';

import styles from './VisitorPrisoners.module.css';

const DEFAULT_AVATAR = '/images/avatars/prisoner-default.PNG';

export default function VisitorPrisonersScreen() {
  const protectedPage = useProtectedPage();
  const [prisoners, setPrisoners] = useState<PrisonerOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!protectedPage.isReady) return;
    let active = true;
    setLoading(true);
    setError(null);

    getAvailablePrisoners()
      .then((data) => { if (active) setPrisoners(data); })
      .catch((caughtError) => {
        if (!active) return;
        if (isApiServiceError(caughtError) && caughtError.status === 401) {
          protectedPage.redirectToLogin();
          return;
        }
        if (isApiServiceError(caughtError) && caughtError.status === 403) {
          setError('Access denied');
          return;
        }
        setError(
          isApiServiceError(caughtError)
            ? caughtError.message
            : 'Unable to load prisoners',
        );
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [protectedPage.isReady, protectedPage.redirectToLogin]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return prisoners;
    return prisoners.filter(
      (prisoner) =>
        prisoner.name.toLowerCase().includes(term) ||
        prisoner.publicId.toLowerCase().includes(term),
    );
  }, [prisoners, search]);

  if (protectedPage.isLoading || loading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) {
    return <div className="container-xxl flex-grow-1 container-p-y"><LoadingAlert>Loading available prisoners...</LoadingAlert></div>;
  }
  if (protectedPage.isForbidden || error === 'Access denied') return <div className="container-xxl flex-grow-1 container-p-y"><ForbiddenAlert /></div>;
  if (protectedPage.error || error) return <div className="container-xxl flex-grow-1 container-p-y"><ErrorAlert>{protectedPage.error || error}</ErrorAlert></div>;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className={styles.heading}>
        <div><span>Visitor directory</span><h1>View Prisoner</h1><p>Browse active Prisoners available for appointment requests.</p></div>
        <label className={styles.search}>
          <Search aria-hidden="true" />
          <span className="visually-hidden">Search prisoners by name or public ID</span>
          <input onChange={(event) => setSearch(event.target.value)} placeholder="Search name or PRN ID" type="search" value={search} />
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyStateAlert>No prisoners match your search.</EmptyStateAlert>
      ) : (
        <div className={styles.grid}>
          {filtered.map((prisoner) => (
            <article className={styles.card} key={prisoner.publicId}>
              <img alt={`${prisoner.name} profile picture`} height={64} loading="lazy" src={prisoner.profilePic || DEFAULT_AVATAR} width={64} />
              <div className={styles.cardBody}>
                <h2>{prisoner.name}</h2>
                <span>{prisoner.publicId}</span>
              </div>
              <Link className="btn btn-primary" href={`/visitor/prisoners/${encodeURIComponent(prisoner.publicId)}`}>View Profile</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
