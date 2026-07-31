'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarPlus } from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getPublicPrisoner } from '@features/appointments/services/appointment.service';
import type { PublicPrisonerDetail } from '@features/appointments/types';
import { isApiServiceError } from '@/types/api';

import styles from './VisitorPrisoners.module.css';

const DEFAULT_AVATAR = '/images/avatars/prisoner-default.PNG';
const formatDate = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));

export default function VisitorPrisonerDetailScreen() {
  const params = useParams<{ prisonerPublicId: string }>();
  const protectedPage = useProtectedPage();
  const [prisoner, setPrisoner] = useState<PublicPrisonerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const publicId = (params.prisonerPublicId ?? '').toUpperCase();

  useEffect(() => {
    if (!protectedPage.isReady || !publicId) return;
    let active = true;
    setLoading(true);
    setError(null);
    getPublicPrisoner(publicId)
      .then((data) => { if (active) setPrisoner(data); })
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
        setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to load prisoner');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [protectedPage.isReady, protectedPage.redirectToLogin, publicId]);

  if (protectedPage.isLoading || loading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) {
    return <div className="container-xxl flex-grow-1 container-p-y"><LoadingAlert>Loading Prisoner profile...</LoadingAlert></div>;
  }
  if (protectedPage.isForbidden || error === 'Access denied') return <div className="container-xxl flex-grow-1 container-p-y"><ForbiddenAlert /></div>;
  if (protectedPage.error || error) return <div className="container-xxl flex-grow-1 container-p-y"><ErrorAlert>{protectedPage.error || error}</ErrorAlert></div>;
  if (!prisoner) return null;

  const details = [
    ['Public ID', prisoner.publicId],
    ['Age', String(prisoner.age)],
    ['Gender', prisoner.gender],
    ['Admission date', formatDate(prisoner.admissionDate)],
    ['Sentence period', prisoner.sentencePeriod || 'Not provided'],
    ['Jail type', prisoner.jailType || 'Not provided'],
    ['Jail name', prisoner.jailName || 'Not provided'],
  ];

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <section className={styles.detailCard}>
        <img alt={`${prisoner.name} profile picture`} height={360} src={prisoner.profilePic || DEFAULT_AVATAR} width={360} />
        <div className={styles.detailContent}>
          <span>{prisoner.publicId}</span>
          <h1>{prisoner.name}</h1>
          <p className={styles.caseDetails}>{prisoner.caseDetails || 'Public case summary is not available.'}</p>
          <dl className={styles.detailGrid}>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <div className={styles.actions}>
            <Link className="btn btn-primary" href={`/visitor/appointments/book?prisoner=${encodeURIComponent(prisoner.publicId)}`}><CalendarPlus aria-hidden="true" /> Book Appointment</Link>
            <Link className="btn btn-outline-secondary" href="/visitor/prisoners"><ArrowLeft aria-hidden="true" /> Back to Prisoners</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
