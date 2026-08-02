'use client';

import { useEffect, useState } from 'react';

import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { getVisitorJailRules } from '../services/visitor-services.service';
import type { JailRule } from '../types';
import styles from '../components/VisitorServices.module.css';

export default function VisitRulesScreen() {
  const auth = useProtectedPage();
  const [rules, setRules] = useState<JailRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!auth.isReady) return;
    setLoading(true);
    void getVisitorJailRules().then(setRules).catch((caught) => {
      if (isApiServiceError(caught) && caught.status === 401) auth.redirectToLogin();
      else setError(isApiServiceError(caught) ? caught.message : 'Unable to load jail rules');
    }).finally(() => setLoading(false));
  }, [auth.isReady, auth.redirectToLogin]);
  if (auth.isLoading || loading) return <div className={styles.page}><LoadingAlert>Loading jail rules…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  if (auth.error || error) return <div className={styles.page}><ErrorAlert>{auth.error || error}</ErrorAlert></div>;
  return <div className={styles.page}><h1 className={styles.heading}>Jail Rules and Visit Instructions</h1><p className={styles.subheading}>Review these instructions before every visit.</p>{!rules.length ? <EmptyStateAlert className={styles.empty}>No active rules are currently published.</EmptyStateAlert> : <div className={styles.twoColumns}>{rules.map((rule) => <article className={styles.card} key={rule.id}><p className={styles.ruleCategory}>{rule.category}</p><h2>{rule.title}</h2><p className={styles.ruleContent}>{rule.content}</p></article>)}</div>}</div>;
}
