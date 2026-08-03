'use client';

import { useEffect, useState } from 'react';
import { ErrorAlert, LoadingAlert } from '@components/common/StatusAlert';
import { getAdminProfile } from '../services/admin-operations.service';
import styles from '../components/AdminOperations.module.css';

type Activity = { action:string; entity:string; entityReference:string|null; result:string|null; createdAt:string };
type Profile = { name:string; email:string|null; role:string; isActive:boolean; profileImageUrl:string|null; createdAt:string; passwordChangedAt:string|null; recentActivity:Activity[] };
const date=(value:string|null)=>value?new Date(value).toLocaleString():'Not recorded';

export default function AdminProfileScreen(){
  const [data,setData]=useState<Profile|null>(null); const [error,setError]=useState<string|null>(null);
  useEffect(()=>{void getAdminProfile().then((value)=>setData(value as unknown as Profile)).catch(()=>setError('Unable to load Admin profile.'))},[]);
  if(error)return <div className={styles.page}><ErrorAlert>{error}</ErrorAlert></div>;
  if(!data)return <div className={styles.page}><LoadingAlert>Loading Admin profile…</LoadingAlert></div>;
  const fields=[['Full name',data.name],['Email',data.email||'Email unavailable'],['Role','ADMIN'],['Account status',data.isActive?'Active':'Inactive'],['Created date',date(data.createdAt)],['Password-changed date',date(data.passwordChangedAt)]];
  return <div className={styles.page}><div className={styles.header}><div><h1>My Profile</h1><p className={styles.muted}>Read-only permanent Admin account information</p></div></div><section className={styles.profileCard}><div className={styles.profileImageColumn}><img alt={`${data.name} profile`} src={data.profileImageUrl||'/images/avatars/admin-default.PNG'}/><strong>ADMIN</strong></div><dl className={styles.profileGrid}>{fields.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section><section className={`${styles.card} mt-3`}><h2>Recent Activity</h2>{data.recentActivity.length?<div className={styles.activityList}>{data.recentActivity.map((item)=><article key={`${item.createdAt}:${item.action}`}><strong>{item.action} · {item.entity}</strong><span>{item.entityReference||'No public reference'} · {item.result||'No result'}</span><time dateTime={item.createdAt}>{date(item.createdAt)}</time></article>)}</div>:<p>No recent activity.</p>}</section></div>;
}
