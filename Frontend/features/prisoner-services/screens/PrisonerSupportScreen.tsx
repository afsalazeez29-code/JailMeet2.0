'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { createPrisonerSupportRequest, getPrisonerSupportRequests } from '../services/prisoner-services.service';
import type { PrisonerSupportCategory, PrisonerSupportPage } from '../types';
import styles from '../components/PrisonerServices.module.css';

const categories: PrisonerSupportCategory[] = ['PAROLE', 'VISITATION', 'CASE_SENTENCE', 'PROFILE_CORRECTION', 'MEDICAL_ASSISTANCE', 'LEGAL_ASSISTANCE', 'TECHNICAL', 'OTHER'];
const dateTime = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function PrisonerSupportScreen() {
  const auth = useProtectedPage();
  const [data, setData] = useState<PrisonerSupportPage | null>(null);
  const [category, setCategory] = useState<PrisonerSupportCategory>('PAROLE');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const load = useCallback(async () => { setLoading(true); try { setData(await getPrisonerSupportRequests(page)); } catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to load support requests.'); } finally { setLoading(false); } }, [page]);
  useEffect(() => { if (auth.isReady) void load(); }, [auth.isReady, load]);
  const submit = async (event: FormEvent) => { event.preventDefault(); setSaving(true); setError(null); setSuccess(null); try { await createPrisonerSupportRequest({ category, subject, message }); setSubject(''); setMessage(''); setSuccess('Your request was sent to the Admin.'); await load(); } catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to submit support request.'); } finally { setSaving(false); } };
  if (auth.isLoading || (loading && !data)) return <div className={styles.page}><LoadingAlert>Loading support requests…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  return <div className={styles.page}><h1 className={styles.heading}>Support / Grievance</h1><p className={styles.subheading}>Send an internal request to the JailMeet Admin and track the reply.</p>{auth.error || error ? <ErrorAlert>{auth.error || error}</ErrorAlert> : null}{success ? <SuccessAlert>{success}</SuccessAlert> : null}<div className={styles.twoColumns}><section className={styles.card}><h2>New Support / Grievance</h2><form className={styles.form} onSubmit={submit}><div className={styles.field}><label htmlFor="support-category">Category</label><select id="support-category" onChange={(event) => setCategory(event.target.value as PrisonerSupportCategory)} value={category}>{categories.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}</select></div><div className={styles.field}><label htmlFor="support-subject">Subject</label><input id="support-subject" maxLength={150} minLength={3} onChange={(event) => setSubject(event.target.value)} required value={subject} /></div><div className={styles.field}><label htmlFor="support-message">Message</label><textarea id="support-message" maxLength={3000} minLength={10} onChange={(event) => setMessage(event.target.value)} required value={message} /></div><button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Sending…' : 'Send Request'}</button></form></section><section><h2 className={styles.heading}>Previous Requests</h2>{!data?.items.length ? <EmptyStateAlert>No support requests submitted.</EmptyStateAlert> : <div className={styles.grid}>{data.items.map((request) => <article className={styles.card} key={request.id}><div className={styles.cardHeader}><div><p className={styles.meta}>{request.category.replaceAll('_', ' ')}</p><h2>{request.subject}</h2></div><span className={`${styles.status} ${styles[request.status.toLowerCase() as 'open' | 'in_progress' | 'resolved' | 'closed']}`}>{request.status.replaceAll('_', ' ')}</span></div><p className={styles.content}>{request.message}</p><p className={styles.meta}>Submitted {dateTime(request.createdAt)} · Updated {dateTime(request.updatedAt)}</p>{request.adminReply ? <div className={styles.reply}><strong>Admin reply</strong><p>{request.adminReply}</p></div> : <p className={styles.muted}>No Admin reply yet.</p>}{request.resolvedAt ? <p className={styles.meta}>Resolved {dateTime(request.resolvedAt)}</p> : null}</article>)}</div>}{data && data.pagination.totalPages > 1 ? <div className={styles.actions}><button className="btn btn-outline-secondary" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} type="button">Previous</button><span>Page {page} of {data.pagination.totalPages}</span><button className="btn btn-outline-secondary" disabled={page >= data.pagination.totalPages || loading} onClick={() => setPage((value) => value + 1)} type="button">Next</button></div> : null}</section></div></div>;
}
