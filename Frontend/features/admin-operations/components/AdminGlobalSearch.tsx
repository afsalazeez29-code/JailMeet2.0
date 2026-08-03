'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { searchAdmin, type SearchData } from '../services/admin-operations.service';
import styles from './AdminOperations.module.css';

export default function AdminGlobalSearch() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [data, setData] = useState<SearchData | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const results = data?.groups.flatMap((group) => group.items) ?? [];

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) { setData(null); setOpen(false); setActiveIndex(-1); return; }
    const timer = window.setTimeout(async () => {
      setLoading(true); setOpen(true);
      try { setData(await searchAdmin(query, 1, 8)); setError(null); }
      catch { setError('Search is temporarily unavailable.'); }
      finally { setLoading(false); }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!wrap.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const navigate = (href: string) => { setValue(''); setOpen(false); setActiveIndex(-1); router.push(href); };
  const submit = () => { if (value.trim().length >= 2) navigate(`/admin/search?q=${encodeURIComponent(value.trim())}`); };

  return <div className={styles.globalSearch} ref={wrap}>
    <form className={styles.globalSearchForm} role="search" onSubmit={(event) => { event.preventDefault(); submit(); }}>
      <Search aria-hidden="true" size={17} />
      <input
        aria-controls="admin-search-results"
        aria-expanded={open}
        aria-label="Search Admin records"
        autoComplete="off"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') { setOpen(false); setActiveIndex(-1); }
          if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); setOpen(true); setActiveIndex((index) => (index + 1) % results.length); }
          if (event.key === 'ArrowUp' && results.length) { event.preventDefault(); setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1)); }
          if (event.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) { event.preventDefault(); navigate(results[activeIndex].href); }
        }}
        placeholder="Search name, email or public ID"
        type="search"
        value={value}
      />
    </form>
    {open ? <section aria-label="Admin search results" className={styles.searchDropdown} id="admin-search-results">
      {loading ? <p>Searching…</p> : null}
      {error ? <p className="text-danger" role="alert">{error}</p> : null}
      {!loading && !error && !results.length ? <p>No safe matching records.</p> : null}
      {results.map((item, index) => <button className={`${styles.searchResult} ${index === activeIndex ? styles.searchResultActive : ''}`} key={`${item.type}:${item.reference}`} onClick={() => navigate(item.href)} type="button">
        <img alt="" src={item.imageUrl || (item.role === 'OFFICER' ? '/images/avatars/officer-default.PNG' : item.role === 'PRISONER' ? '/images/avatars/prisoner-default.PNG' : '/images/avatars/visitor-default.png')} />
        <span><strong>{item.title}</strong><small>{item.role || item.type} · {item.reference} · {item.isActive === undefined ? item.subtitle : item.isActive ? 'Active' : 'Inactive'}</small></span>
      </button>)}
      {results.length ? <button className={styles.viewAllSearch} onClick={submit} type="button">View all results</button> : null}
    </section> : null}
  </div>;
}
