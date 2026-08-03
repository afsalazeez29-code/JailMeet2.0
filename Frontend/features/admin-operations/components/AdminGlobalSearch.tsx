'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { searchAdmin, type SearchData } from '../services/admin-operations.service';

export default function AdminGlobalSearch() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [data, setData] = useState<SearchData | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (value.trim().length < 2) { setData(null); setOpen(false); return; }
    const timer = window.setTimeout(async () => { setLoading(true); try { setData(await searchAdmin(value.trim(), 1, 8)); setOpen(true); setError(null); } catch { setError('Search is temporarily unavailable.'); setOpen(true); } finally { setLoading(false); } }, 350);
    return () => window.clearTimeout(timer);
  }, [value]);
  useEffect(() => { const close = (event: MouseEvent) => { if (!wrap.current?.contains(event.target as Node)) setOpen(false); }; const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; document.addEventListener('mousedown', close); document.addEventListener('keydown', escape); return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape); }; }, []);
  const results = data?.groups.flatMap((group) => group.items) ?? [];
  return <div className="position-relative flex-grow-1" ref={wrap} style={{ maxWidth: 420 }}><form className="input-group" role="search" onSubmit={(event) => { event.preventDefault(); if (value.trim().length >= 2) router.push(`/admin/search?q=${encodeURIComponent(value.trim())}`); }}><span className="input-group-text"><Search aria-hidden="true" size={16}/></span><input aria-label="Search Admin records" className="form-control" onChange={(event) => setValue(event.target.value)} placeholder="Search public IDs and references" value={value}/></form>{open ? <section aria-label="Admin search results" className="position-absolute bg-white border rounded shadow p-2 mt-2 w-100" style={{ zIndex: 1100, maxHeight: 420, overflowY: 'auto' }}>{loading ? <p className="p-2 mb-0">Searching…</p> : null}{error ? <p className="text-danger p-2 mb-0" role="alert">{error}</p> : null}{!loading && !error && !results.length ? <p className="p-2 mb-0">No safe matching records.</p> : null}{results.map((item) => <Link className="d-block p-2 rounded text-decoration-none" href={item.href} key={`${item.type}:${item.reference}`} onClick={() => setOpen(false)}><strong>{item.title}</strong><small className="d-block text-muted">{item.type} · {item.reference} · {item.subtitle}</small></Link>)}{results.length ? <Link className="btn btn-link w-100" href={`/admin/search?q=${encodeURIComponent(value.trim())}`} onClick={() => setOpen(false)}>View all results</Link> : null}</section> : null}</div>;
}
