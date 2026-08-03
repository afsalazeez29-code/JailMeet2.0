'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { EmptyStateAlert, ErrorAlert, LoadingAlert, SuccessAlert } from '@components/common/StatusAlert';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { isApiServiceError } from '@/types/api';
import { officerGet, officerMutation, Paginated, refreshOfficerEvents } from './service';

type Row = Record<string, any>;
const text = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return 'â€”';
  if (typeof value === 'object') return Object.entries(value as Record<string, unknown>).filter(([k]) => !['id', 'userId'].includes(k)).map(([k, v]) => `${k}: ${text(v)}`).join(' | ');
  return String(value);
};
const safeEntries = (row: Row) => Object.entries(row).filter(([key]) => !['id', 'userId', 'profileImagePublicId', 'assignedOfficerId', 'createdByOfficerId'].includes(key));

export default function ResourceScreen({ title, endpoint, empty = 'No records found.', prisonerLinks = false, action, queryable = true }: { title: string; endpoint: string; empty?: string; prisonerLinks?: boolean; action?: 'CHANGE_REQUEST'; queryable?: boolean }) {
  const protectedPage = useProtectedPage();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const join = endpoint.includes('?') ? '&' : '?'; const path = queryable ? `${endpoint}${join}page=1&limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}` : endpoint; const data = await officerGet<Paginated<Row> | Row[] | Row>(path); setItems(Array.isArray(data) ? data : 'items' in data ? data.items : [data]); }
    catch (caught) { setError(isApiServiceError(caught) ? caught.message : 'Unable to load records'); }
    finally { setLoading(false); }
  }, [endpoint, queryable, search]);
  useEffect(() => { if (protectedPage.isReady) void load(); }, [protectedPage.isReady, load]);

  const decide = async (reference: string, status: 'APPROVED' | 'REJECTED') => {
    setError(null); setSuccess(null);
    const officerReply = window.prompt(status === 'REJECTED' ? 'Enter a rejection reply:' : 'Optional Officer reply:')?.trim();
    if (status === 'REJECTED' && !officerReply) return;
    try { await officerMutation(`/officer/appointment-change-requests/${encodeURIComponent(reference)}`, 'PATCH', { status, officerReply: officerReply || undefined }); setSuccess('Request reviewed successfully.'); refreshOfficerEvents(); await load(); }
    catch (caught) { setError(isApiServiceError(caught) && caught.status === 409 ? 'Another Officer already processed this item. The queue has been refreshed.' : isApiServiceError(caught) ? caught.message : 'Unable to process request'); await load(); }
  };
  if (protectedPage.isLoading || loading) return <div className="pd-20"><LoadingAlert>Loading {title.toLowerCase()}...</LoadingAlert></div>;
  if (protectedPage.isForbidden) return <div className="pd-20"><ErrorAlert>Access denied.</ErrorAlert></div>;
  return <div className="pd-20"><div className="card-box mb-30"><div className="pd-20"><h1 className="h4 text-blue">{title}</h1>{queryable ? <form className="row g-2 mt-2" onSubmit={(e: FormEvent) => { e.preventDefault(); void load(); }} role="search"><div className="col-md-8"><label className="visually-hidden" htmlFor={`${title}-search`}>Search</label><input id={`${title}-search`} className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by public ID, reference, or name" /></div><div className="col-md-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Search</button><button className="btn btn-outline-secondary" type="button" onClick={() => setSearch('')}>Reset</button></div></form> : null}</div><div className="pd-20 pt-0">{error ? <ErrorAlert>{error}</ErrorAlert> : null}{success ? <SuccessAlert>{success}</SuccessAlert> : null}{!items.length ? <EmptyStateAlert>{empty}</EmptyStateAlert> : <div className="table-responsive"><table className="table table-striped align-middle"><thead><tr>{safeEntries(items[0]).map(([key]) => <th key={key}>{key.replace(/([A-Z])/g, ' $1')}</th>)}{prisonerLinks || action ? <th>Action</th> : null}</tr></thead><tbody>{items.map((row, index) => <tr key={row.reference || row.publicId || index}>{safeEntries(row).map(([key, value]) => <td key={key}>{text(value)}</td>)}{prisonerLinks || action ? <td>{prisonerLinks ? <Link className="btn btn-sm btn-outline-primary" href={`/officer/prisoners/${row.publicId}`}>View Details</Link> : null}{action === 'CHANGE_REQUEST' && row.status === 'PENDING' ? <div className="d-flex gap-2"><button className="btn btn-sm btn-success" onClick={() => void decide(row.reference, 'APPROVED')} type="button">Approve</button><button className="btn btn-sm btn-danger" onClick={() => void decide(row.reference, 'REJECTED')} type="button">Reject</button></div> : null}</td> : null}</tr>)}</tbody></table></div>}</div></div></div>;
}
