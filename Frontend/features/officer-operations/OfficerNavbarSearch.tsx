'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { officerGet } from './service';
import styles from '@components/common/NavbarSearch.module.css';

type Result = { publicId: string | null; name: string; profilePic: string | null; user: { role: string; isActive: boolean } };
type Data = { visitors: Result[]; prisoners: Result[] };

export default function OfficerNavbarSearch() {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const results = [...(data?.visitors ?? []).map((item) => ({ ...item, group: 'visitors' })), ...(data?.prisoners ?? []).map((item) => ({ ...item, group: 'prisoners' }))];

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) { setData(null); setOpen(false); return; }
    const timer = window.setTimeout(async () => { setLoading(true); setOpen(true); try { setData(await officerGet<Data>(`/officer/search?q=${encodeURIComponent(query)}&limit=8`)); setError(null); } catch { setError('Search is temporarily unavailable.'); } finally { setLoading(false); } }, 350);
    return () => window.clearTimeout(timer);
  }, [value]);
  useEffect(() => { const close = (event: MouseEvent) => { if (!wrap.current?.contains(event.target as Node)) setOpen(false); }; const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; document.addEventListener('mousedown', close); document.addEventListener('keydown', key); return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', key); }; }, []);
  const navigate = (href: string) => { setValue(''); setOpen(false); router.push(href); };
  const fullSearch = () => { if (value.trim().length >= 2) navigate(`/officer/search?q=${encodeURIComponent(value.trim())}`); };

  return <div className={styles.searchWrap} ref={wrap}><form className={styles.searchForm} onSubmit={(event) => { event.preventDefault(); fullSearch(); }} role="search"><Search aria-hidden="true" className={styles.searchIcon} size={16}/><input aria-expanded={open} aria-label="Search Visitors and assigned Prisoners" className={styles.searchInput} onChange={(event) => setValue(event.target.value)} placeholder="Name, VIS- or PRN-" type="search" value={value}/></form>{open ? <section className={styles.dropdown} aria-label="Officer search results">{loading ? <p>Searching…</p> : null}{error ? <p role="alert">{error}</p> : null}{!loading && !error && !results.length ? <p>No permitted results.</p> : null}{results.map((item) => item.publicId ? <button className={styles.result} key={`${item.group}:${item.publicId}`} onClick={() => navigate(item.group === 'prisoners' ? `/officer/prisoners/${item.publicId}` : `/officer/appointments?visitorPublicId=${item.publicId}`)} type="button"><img alt="" src={item.profilePic || (item.group === 'prisoners' ? '/images/avatars/prisoner-default.PNG' : '/images/avatars/visitor-default.png')}/><span><strong>{item.name}</strong><small>{item.user.role} · {item.publicId} · {item.user.isActive ? 'Active' : 'Inactive'}</small></span></button> : null)}{results.length ? <button className={styles.viewAll} onClick={fullSearch} type="button">View all results</button> : null}</section> : null}</div>;
}
