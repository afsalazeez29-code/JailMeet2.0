'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { createSupportRequest, getVisitorSupportRequests } from '../services/visitor-services.service';
import type { SupportCategory, SupportRequest } from '../types';
import styles from '../components/VisitorServices.module.css';

const categories: SupportCategory[] = ['APPOINTMENT', 'PROFILE', 'VISIT_PASS', 'TECHNICAL', 'OTHER'];
const format = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function VisitorSupportScreen() {
  const auth = useProtectedPage();
  const [items, setItems] = useState<SupportRequest[]>([]);
  const [category, setCategory] = useState<SupportCategory>('APPOINTMENT');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems((await getVisitorSupportRequests()).items); }
    catch (caught) {
      if (isApiServiceError(caught) && caught.status === 401) auth.redirectToLogin();
      else setError(isApiServiceError(caught) ? caught.message : 'Unable to load support requests');
    } finally { setLoading(false); }
  }, [auth.redirectToLogin]);

  useEffect(() => { if (auth.isReady) void load(); }, [auth.isReady, load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(null); setSuccess(null); setSubmitting(true);
    try {
      await createSupportRequest({ category, subject, message });
      setSubject(''); setMessage(''); setSuccess('Support request submitted successfully.');
      await load();
    } catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to submit support request'); }
    finally { setSubmitting(false); }
  };

  if (auth.isLoading || (loading && !items.length)) return <div className={styles.page}><LoadingAlert>Loading support…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;

  return <div className={styles.page}>
    <h1 className={styles.heading}>Visitor Support</h1><p className={styles.subheading}>Send an internal request to the permanent JailMeet Admin.</p>
    {auth.error || error ? <ErrorAlert role="alert">{auth.error || error}</ErrorAlert> : null}{success ? <SuccessAlert role="status">{success}</SuccessAlert> : null}
    <div className={styles.twoColumns}>
      <section className={styles.card}><h2>Create Support Request</h2><form className={styles.form} onSubmit={submit}>
        <div className={styles.field}><label htmlFor="support-category">Category</label><select id="support-category" onChange={(event) => setCategory(event.target.value as SupportCategory)} value={category}>{categories.map((value) => <option key={value} value={value}>{value.replace('_', ' ')}</option>)}</select></div>
        <div className={styles.field}><label htmlFor="support-subject">Subject</label><input id="support-subject" maxLength={150} minLength={3} onChange={(event) => setSubject(event.target.value)} required value={subject} /></div>
        <div className={styles.field}><label htmlFor="support-message">Message</label><textarea id="support-message" maxLength={3000} minLength={10} onChange={(event) => setMessage(event.target.value)} required value={message} /></div>
        <button className="btn btn-primary" disabled={submitting} type="submit">{submitting ? 'Submitting…' : 'Submit Request'}</button>
      </form></section>
      <section><h2 className={styles.heading}>Previous Requests</h2>{!items.length ? <EmptyStateAlert className={styles.empty}>No support requests yet.</EmptyStateAlert> : <div className={styles.grid}>{items.map((item) => <article className={styles.card} key={item.id}><div className={styles.cardHeader}><div><p className={styles.ruleCategory}>{item.category.replace('_', ' ')}</p><h2>{item.subject}</h2><p className={styles.muted}>Submitted {format(item.createdAt)} · Updated {format(item.updatedAt)}</p></div><span className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>{item.status.replace('_', ' ')}</span></div><p className={styles.ruleContent}>{item.message}</p>{item.adminReply ? <div className={styles.reply}><strong>Admin reply</strong><p className={styles.ruleContent}>{item.adminReply}</p></div> : null}</article>)}</div>}</section>
    </div>
  </div>;
}
