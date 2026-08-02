'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

import { EmptyStateAlert, ErrorAlert, SuccessAlert } from '@components/common/StatusAlert';
import { isApiServiceError } from '@/types/api';
import {
  getOfficerChangeRequests,
  reviewChangeRequest,
  useVisitPass,
  verifyVisitPass,
} from '../services/visitor-services.service';
import type { ChangeRequest, VisitPass } from '../types';
import styles from './OfficerVisitorTools.module.css';

const format = (value: string) => new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function OfficerVisitorTools() {
  const [passCode, setPassCode] = useState('');
  const [verifiedPass, setVerifiedPass] = useState<VisitPass | null>(null);
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try { setRequests(await getOfficerChangeRequests()); }
    catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to load appointment change requests'); }
  }, []);
  useEffect(() => { void loadRequests(); }, [loadRequests]);

  const verify = async (event: FormEvent) => {
    event.preventDefault(); setError(null); setSuccess(null); setBusy('verify');
    try { setVerifiedPass(await verifyVisitPass(passCode.trim())); setSuccess('Visit pass is valid.'); }
    catch (caught) { setVerifiedPass(null); setError(isApiServiceError(caught) ? caught.message : 'Unable to verify visit pass'); }
    finally { setBusy(null); }
  };

  const complete = async () => {
    if (!verifiedPass) return; setBusy('use'); setError(null);
    try { setVerifiedPass(await useVisitPass(verifiedPass.passCode)); setSuccess('Visit marked as completed.'); }
    catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to complete visit'); }
    finally { setBusy(null); }
  };

  const review = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    setBusy(requestId); setError(null);
    try { await reviewChangeRequest(requestId, status, replies[requestId]?.trim()); await loadRequests(); setSuccess(`Change request ${status.toLowerCase()}.`); }
    catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to review request'); }
    finally { setBusy(null); }
  };

  return <section className={styles.section} aria-label="Visitor service tools">
    {error ? <ErrorAlert role="alert">{error}</ErrorAlert> : null}{success ? <SuccessAlert role="status">{success}</SuccessAlert> : null}
    <div className={styles.grid}>
      <div className={styles.card}><h4 className="text-blue h4">Verify Visit Pass</h4><p>Enter or scan the opaque pass code.</p><form className={styles.form} onSubmit={verify}><input aria-label="Visit pass code" className="form-control" minLength={20} onChange={(event) => setPassCode(event.target.value)} required value={passCode} /><button className="btn btn-primary" disabled={busy === 'verify'} type="submit">{busy === 'verify' ? 'Verifying…' : 'Verify'}</button></form>{verifiedPass ? <div className={styles.result}><strong>{verifiedPass.visitor.name}</strong><p className={styles.meta}>{verifiedPass.visitor.publicId || 'Visitor'} visiting {verifiedPass.prisoner.name} ({verifiedPass.prisoner.publicId})</p><p className={styles.meta}>{format(verifiedPass.appointmentAt)} · {verifiedPass.purpose}</p><button className="btn btn-success btn-sm" disabled={busy === 'use' || verifiedPass.passStatus !== 'ACTIVE'} onClick={() => void complete()} type="button">{busy === 'use' ? 'Completing…' : 'Mark Visit Completed'}</button></div> : null}</div>
      <div className={styles.card}><h4 className="text-blue h4">Appointment Change Requests</h4>{!requests.length ? <EmptyStateAlert>No pending change requests.</EmptyStateAlert> : requests.map((request) => <article className={styles.request} key={request.id}><strong>{request.visitor?.name} ({request.visitor?.publicId || 'Visitor'})</strong><p className={styles.meta}>{request.requestType} · {request.appointment.prisoner.name} ({request.appointment.prisoner.publicId})</p><p className={styles.meta}>Current: {format(request.appointment.appointmentAt)}{request.requestedAt ? ` · Requested: ${format(request.requestedAt)}` : ''}</p><p>{request.reason}</p><input aria-label={`Officer reply for ${request.visitor?.name}`} className={`form-control ${styles.reply}`} maxLength={500} onChange={(event) => setReplies((current) => ({ ...current, [request.id]: event.target.value }))} placeholder="Optional Officer reply" value={replies[request.id] || ''} /><div className={styles.actions}><button className="btn btn-success btn-sm" disabled={busy === request.id} onClick={() => void review(request.id, 'APPROVED')} type="button">Approve</button><button className="btn btn-danger btn-sm" disabled={busy === request.id} onClick={() => void review(request.id, 'REJECTED')} type="button">Reject</button></div></article>)}</div>
    </div>
  </section>;
}
