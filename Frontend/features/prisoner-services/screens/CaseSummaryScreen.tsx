'use client';

import { useEffect, useState } from 'react';
import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { getPrisonerCaseSummary } from '../services/prisoner-services.service';
import type { PrisonerCaseSummary } from '../types';
import styles from '../components/PrisonerServices.module.css';

const value = (input: string | null) => input || 'Not provided';
const date = (input: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(input));

export default function CaseSummaryScreen() {
  const auth = useProtectedPage();
  const [summary, setSummary] = useState<PrisonerCaseSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (!auth.isReady) return; let active = true; setLoading(true); getPrisonerCaseSummary().then((data) => { if (active) setSummary(data); }).catch((caught) => { if (active) setError(isApiServiceError(caught) ? caught.message : 'Unable to load case summary.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [auth.isReady]);
  if (auth.isLoading || loading) return <div className={styles.page}><LoadingAlert>Loading case and sentence summary…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  if (auth.error || error || !summary) return <div className={styles.page}><ErrorAlert>{auth.error || error || 'Case summary is unavailable.'}</ErrorAlert></div>;
  return <div className={styles.page}><h1 className={styles.heading}>Case &amp; Sentence Summary</h1><p className={styles.subheading}>This information is read-only. Request corrections through Support / Grievance.</p><div className={styles.twoColumns}><section className={styles.card}><h2>Case Information</h2><p className={styles.content}>{value(summary.caseDetails)}</p></section><section className={styles.card}><h2>Sentence and Custody</h2><dl className={styles.detailGrid}><div><dt>Prisoner ID</dt><dd>{value(summary.publicId)}</dd></div><div><dt>Sentence period</dt><dd>{value(summary.sentencePeriod)}</dd></div><div><dt>Admission date</dt><dd>{date(summary.admissionDate)}</dd></div><div><dt>Cell number</dt><dd>{value(summary.cellNumber)}</dd></div><div><dt>Jail type</dt><dd>{value(summary.jailType)}</dd></div><div><dt>Jail name</dt><dd>{value(summary.jailName)}</dd></div></dl></section><section className={styles.card}><h2>Assigned Officer</h2><dl className={styles.detailGrid}><div><dt>Name</dt><dd>{summary.assignedOfficer?.name || 'No Officer assigned'}</dd></div><div><dt>Public ID</dt><dd>{summary.assignedOfficer?.publicId || 'Not provided'}</dd></div></dl></section></div></div>;
}
