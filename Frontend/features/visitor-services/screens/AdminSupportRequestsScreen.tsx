'use client';

import { useCallback, useEffect, useState } from 'react';

import { EmptyStateAlert, ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { getAdminSupportRequests, updateSupportRequest } from '../services/visitor-services.service';
import type { SupportCategory, SupportRequest, SupportStatus } from '../types';
import styles from '../components/VisitorServices.module.css';

const statuses: Array<SupportStatus | 'ALL'> = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const categories: Array<SupportCategory | 'ALL'> = ['ALL', 'APPOINTMENT', 'PROFILE', 'VISIT_PASS', 'TECHNICAL', 'OTHER'];

export default function AdminSupportRequestsScreen() {
  const auth = useProtectedPage();
  const [items, setItems] = useState<SupportRequest[]>([]);
  const [status, setStatus] = useState<SupportStatus | 'ALL'>('ALL');
  const [category, setCategory] = useState<SupportCategory | 'ALL'>('ALL');
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [decisions, setDecisions] = useState<Record<string, Exclude<SupportStatus, 'OPEN'>>>({});
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => { setLoading(true); try { setItems((await getAdminSupportRequests({ status: status === 'ALL' ? undefined : status, category: category === 'ALL' ? undefined : category })).items); } catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to load support requests'); } finally { setLoading(false); } }, [category, status]);
  useEffect(() => { if (auth.isReady) void load(); }, [auth.isReady, load]);

  const save = async (item: SupportRequest) => {
    const nextStatus = decisions[item.id] || (item.status === 'OPEN' ? 'IN_PROGRESS' : item.status as Exclude<SupportStatus, 'OPEN'>);
    setBusy(item.id); setError(null); setSuccess(null);
    try { await updateSupportRequest(item.id, { status: nextStatus, adminReply: replies[item.id]?.trim() || undefined }); setSuccess('Support request updated.'); await load(); }
    catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to update support request'); }
    finally { setBusy(null); }
  };

  if (auth.isLoading || (loading && !items.length)) return <div className={styles.page}><LoadingAlert>Loading support requests…</LoadingAlert></div>;
  if (auth.isForbidden) return <div className={styles.page}><ForbiddenAlert /></div>;
  return <div className={styles.page}><h1 className={styles.heading}>Visitor Support Requests</h1><p className={styles.subheading}>Permanent Admin response and status management.</p>{auth.error || error ? <ErrorAlert>{auth.error || error}</ErrorAlert> : null}{success ? <SuccessAlert>{success}</SuccessAlert> : null}<div className={styles.filters}><select aria-label="Filter by status" className="form-select" onChange={(event) => setStatus(event.target.value as SupportStatus | 'ALL')} value={status}>{statuses.map((value) => <option key={value}>{value}</option>)}</select><select aria-label="Filter by category" className="form-select" onChange={(event) => setCategory(event.target.value as SupportCategory | 'ALL')} value={category}>{categories.map((value) => <option key={value}>{value}</option>)}</select></div>{!items.length ? <EmptyStateAlert>No matching support requests.</EmptyStateAlert> : <div className={styles.grid}>{items.map((item) => <article className={styles.card} key={item.id}><div className={styles.cardHeader}><div><p className={styles.ruleCategory}>{item.category.replace('_', ' ')}</p><h2>{item.subject}</h2><p className={styles.muted}>{item.visitor?.name} · {item.visitor?.publicId || 'Visitor'}</p></div><span className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>{item.status.replace('_', ' ')}</span></div><p className={styles.ruleContent}>{item.message}</p>{item.adminReply ? <div className={styles.reply}><strong>Current reply</strong><p>{item.adminReply}</p></div> : null}<div className={styles.form}><div className={styles.field}><label htmlFor={`reply-${item.id}`}>Admin reply</label><textarea id={`reply-${item.id}`} maxLength={3000} onChange={(event) => setReplies((current) => ({ ...current, [item.id]: event.target.value }))} value={replies[item.id] || ''} /></div><div className={styles.field}><label htmlFor={`status-${item.id}`}>Status</label><select id={`status-${item.id}`} onChange={(event) => setDecisions((current) => ({ ...current, [item.id]: event.target.value as Exclude<SupportStatus, 'OPEN'> }))} value={decisions[item.id] || (item.status === 'OPEN' ? 'IN_PROGRESS' : item.status)}><option value="IN_PROGRESS">IN PROGRESS</option><option value="RESOLVED">RESOLVED</option><option value="CLOSED">CLOSED</option></select></div><button className="btn btn-primary" disabled={busy === item.id} onClick={() => void save(item)} type="button">{busy === item.id ? 'Saving…' : 'Save Reply'}</button></div></article>)}</div>}</div>;
}
