'use client';

import { useEffect, useState } from 'react';
import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import type { JailRule } from '@features/visitor-services/types';
import { getPrisonerRules } from '../services/prisoner-services.service';
import styles from '../components/PrisonerServices.module.css';

export default function PrisonerRulesScreen() {
  const auth = useProtectedPage(); const [rules, setRules] = useState<JailRule[]>([]); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (!auth.isReady) return; let active = true; setLoading(true); getPrisonerRules().then((data) => { if (active) setRules(data); }).catch((caught) => { if (active) setError(isApiServiceError(caught) ? caught.message : 'Unable to load jail rules.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [auth.isReady]);
  if (auth.isLoading || loading) return <div className={styles.page}><LoadingAlert>Loading jail rules…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  if (auth.error || error) return <div className={styles.page}><ErrorAlert>{auth.error || error}</ErrorAlert></div>;
  return <div className={styles.page}><h1 className={styles.heading}>Jail Rules &amp; Prisoner Instructions</h1><p className={styles.subheading}>Active instructions for Prisoners. Contact Support / Grievance if clarification is needed.</p>{!rules.length ? <EmptyStateAlert>No active Prisoner rules are currently published.</EmptyStateAlert> : <div className={styles.grid}>{rules.map((rule) => <article className={styles.card} key={rule.reference}><p className={styles.meta}>{rule.category} · Order {rule.sortOrder}</p><h2>{rule.title}</h2><p className={styles.content}>{rule.content}</p></article>)}</div>}</div>;
}
