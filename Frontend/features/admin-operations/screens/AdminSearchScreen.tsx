'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { ErrorAlert, LoadingAlert } from '@components/common/StatusAlert';
import { searchAdmin, type SearchData } from '../services/admin-operations.service';
import styles from '../components/AdminOperations.module.css';

export default function AdminSearchScreen(){
  const params=useSearchParams(); const initial=params.get('q')||''; const [query,setQuery]=useState(initial); const [submitted,setSubmitted]=useState(initial); const [data,setData]=useState<SearchData|null>(null); const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null);
  useEffect(()=>{if(submitted.trim().length<2){setData(null);return}setLoading(true);void searchAdmin(submitted.trim()).then(setData).catch(()=>setError('Search could not be completed.')).finally(()=>setLoading(false))},[submitted]);
  const submit=(event:FormEvent)=>{event.preventDefault();setError(null);setSubmitted(query)};
  return <div className={styles.page}><div className={styles.header}><div><h1>Admin Search</h1><p className={styles.muted}>Safe public identities and operational references</p></div></div><form className={styles.filters} onSubmit={submit}><label className="visually-hidden" htmlFor="admin-search-page">Search records</label><input className="form-control" id="admin-search-page" minLength={2} maxLength={100} onChange={(event)=>setQuery(event.target.value)} placeholder="Name, email, VIS-, OFR-, PRN- or workflow reference" value={query}/><button className={styles.adminAction} type="submit">Search</button></form>{error?<ErrorAlert>{error}</ErrorAlert>:null}{loading?<LoadingAlert>Searching…</LoadingAlert>:null}{!loading&&data&&!data.groups.length?<p className={styles.card}>No safe matching records.</p>:null}{data?.groups.map((group)=><section className={`${styles.card} mb-3`} key={group.type}><h2>{group.type}</h2><div className={styles.searchPageResults}>{group.items.map((item)=><Link href={item.href} key={item.reference}><img alt="" src={item.imageUrl||(item.role==='OFFICER'?'/images/avatars/officer-default.PNG':item.role==='PRISONER'?'/images/avatars/prisoner-default.PNG':'/images/avatars/visitor-default.png')}/><span><strong>{item.title}</strong><small>{item.role||item.type} · {item.reference} · {item.isActive===undefined?(item.subtitle||''):item.isActive?'Active':'Inactive'}</small></span></Link>)}</div></section>)}</div>;
}
