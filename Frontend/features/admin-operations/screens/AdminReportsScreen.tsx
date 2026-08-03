'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ErrorAlert, LoadingAlert } from '@components/common/StatusAlert';
import { getReports } from '../services/admin-operations.service';
import styles from '../components/AdminOperations.module.css';

type CountRow = { _count: number; role?: string; status?: string; audience?: string; isActive?: boolean };
type ReportData = {
  range: { from: string | null; to: string | null };
  usersByRole: CountRow[]; activeByRole: CountRow[];
  validProfiles: { visitors: number; officers: number; prisoners: number };
  missingProfiles: { visitors: number; officers: number; prisoners: number };
  missingPublicIds: { visitors: number; officers: number; prisoners: number };
  officerWorkload: Array<{ publicId: string | null; name: string; profilePic: string | null; assignedPrisoners: number; pendingAppointments: number; pendingParole: number; pendingChangeRequests: number; escalatedSupport: number }>;
  unassignedPrisoners: number; appointmentsByStatus: CountRow[]; parolesByStatus: CountRow[]; pendingChangeRequests: number;
  visitPassesByStatus: CountRow[]; visitorSupportByStatus: CountRow[]; prisonerSupportByStatus: CountRow[]; escalatedSupport: number;
  firByStatus: CountRow[]; medicalAttention: number; jailRules: CountRow[]; activityEvents: number;
};
const count = (rows: CountRow[], key: 'role' | 'status', value: string) => rows.find((row) => row[key] === value)?._count ?? 0;
const total = (rows: CountRow[]) => rows.reduce((sum, row) => sum + row._count, 0);

export default function AdminReportsScreen() {
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  const [data, setData] = useState<ReportData | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  const invalidRange = Boolean(from && to && (from > to || new Date(to).getTime() - new Date(from).getTime() > 366 * 86400000));
  const load = async () => { if (invalidRange) { setError('From date must not follow To date, and the range cannot exceed 366 days.'); return; } setLoading(true); try { setData(await getReports(from || undefined, to || undefined) as unknown as ReportData); setError(null); } catch { setError('Reports are unavailable for the selected range.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const cards = useMemo(() => data ? [
    ['Total Visitors', count(data.usersByRole, 'role', 'VISITOR'), '/admin/visitors'], ['Valid Visitor Profiles', data.validProfiles.visitors, '/admin/visitors'],
    ['Total Officers', count(data.usersByRole, 'role', 'OFFICER'), '/admin/officers'], ['Valid Officer Profiles', data.validProfiles.officers, '/admin/officers'],
    ['Total Prisoners', count(data.usersByRole, 'role', 'PRISONER'), '/admin/prisoners'], ['Valid Prisoner Profiles', data.validProfiles.prisoners, '/admin/prisoners'],
    ['Active non-Admin accounts', ['VISITOR','OFFICER','PRISONER'].reduce((sum, role) => sum + count(data.activeByRole, 'role', role), 0), '/admin/users?status=ACTIVE'],
    ['Inactive non-Admin accounts', ['VISITOR','OFFICER','PRISONER'].reduce((sum, role) => sum + count(data.usersByRole, 'role', role) - count(data.activeByRole, 'role', role), 0), '/admin/users?status=INACTIVE'],
    ['Missing profiles', Object.values(data.missingProfiles).reduce((a,b)=>a+b,0), '/admin/system-integrity'], ['Missing public IDs', Object.values(data.missingPublicIds).reduce((a,b)=>a+b,0), '/admin/system-integrity'],
    ['Unassigned Prisoners', data.unassignedPrisoners, '/admin/officer-operations?assignment=UNASSIGNED'], ['Pending appointments', count(data.appointmentsByStatus,'status','PENDING'), '/admin/appointments?status=PENDING'],
    ['Pending parole', count(data.parolesByStatus,'status','PENDING'), '/admin/parole?status=PENDING'], ['Open support', count(data.visitorSupportByStatus,'status','OPEN') + count(data.prisonerSupportByStatus,'status','OPEN'), '/admin/support-requests?status=OPEN'],
    ['Escalated support', data.escalatedSupport, '/admin/support-escalations'], ['Active Jail Rules', data.jailRules.filter((row)=>row.isActive).reduce((s,r)=>s+r._count,0), '/admin/jail-rules?status=ACTIVE'],
    ['FIR requiring attention', count(data.firByStatus,'status','OPEN') + count(data.firByStatus,'status','UNDER_REVIEW'), '/admin/fir-records?requiresAttention=true'], ['Medical follow-ups', data.medicalAttention, '/admin/health-records?requiresAttention=true'], ['Completed visits', count(data.appointmentsByStatus,'status','COMPLETED'), '/admin/appointments?status=COMPLETED'],
  ] as Array<[string, number, string]> : [], [data]);
  const submit = (event: FormEvent) => { event.preventDefault(); void load(); };
  const reset = async () => { setFrom(''); setTo(''); setLoading(true); try { setData(await getReports() as unknown as ReportData); setError(null); } catch { setError('Reports are unavailable.'); } finally { setLoading(false); } };
  return <div className={styles.page}><div className={styles.header}><div><h1>Reports & Analytics</h1><p className={styles.muted}>Aggregated operational data only</p></div><button className={styles.adminAction} onClick={() => void load()} type="button">Refresh</button></div>
    <form className={styles.filters} onSubmit={submit}><label>From<input className="form-control" type="date" value={from} onChange={(e)=>setFrom(e.target.value)}/></label><label>To<input className="form-control" type="date" value={to} onChange={(e)=>setTo(e.target.value)}/></label><button className={styles.adminAction} disabled={invalidRange} type="submit">Apply</button><button className={styles.adminAction} type="button" onClick={()=>void reset()}>Reset</button></form>
    <p className={styles.muted}>Selected range: {from || 'All available'} to {to || 'Today'}</p>{error?<ErrorAlert>{error}</ErrorAlert>:null}{loading?<LoadingAlert>Calculating reports…</LoadingAlert>:null}
    {data?<><div className={styles.grid}>{cards.map(([label,value,href])=><Link className={styles.reportCard} href={href} key={label}><span>{label}</span><strong>{value}</strong></Link>)}</div>
    <section className={`${styles.card} mt-3`}><h2>Users by role</h2><div className={styles.tableWrap}><table className="table"><thead><tr><th>Role</th><th>Total</th><th>Active</th><th>Valid profiles</th><th>Integrity issues</th></tr></thead><tbody>{['VISITOR','OFFICER','PRISONER'].map((role)=>{const key=`${role.toLowerCase()}s` as keyof ReportData['validProfiles'];return <tr key={role}><td>{role}</td><td>{count(data.usersByRole,'role',role)}</td><td>{count(data.activeByRole,'role',role)}</td><td>{data.validProfiles[key]}</td><td>{data.missingProfiles[key]+data.missingPublicIds[key]}</td></tr>})}</tbody></table></div></section>
    <section className={`${styles.card} mt-3`}><h2>Officer workload</h2><div className={styles.tableWrap}><table className="table"><thead><tr><th>Officer</th><th>Public ID</th><th>Assigned</th><th>Pending appointments</th><th>Pending parole</th><th>Pending changes</th><th>Escalated support</th></tr></thead><tbody>{data.officerWorkload.map((officer)=><tr key={officer.publicId||officer.name}><td><span className="d-flex align-items-center gap-2"><img alt="" src={officer.profilePic||'/images/avatars/officer-default.PNG'} width={36} height={36} className="rounded object-fit-cover"/>{officer.name}</span></td><td>{officer.publicId||'ID unavailable'}</td><td>{officer.assignedPrisoners}</td><td>{officer.pendingAppointments}</td><td>{officer.pendingParole}</td><td>{officer.pendingChangeRequests}</td><td>{officer.escalatedSupport}</td></tr>)}</tbody></table></div></section>
    <div className={`${styles.grid} mt-3`}>{[['Appointments',data.appointmentsByStatus],['VisitPasses',data.visitPassesByStatus],['Parole',data.parolesByStatus],['Visitor Support',data.visitorSupportByStatus],['Prisoner Support',data.prisonerSupportByStatus],['FIR',data.firByStatus]].map(([label,rows])=><section className={styles.card} key={String(label)}><h2>{String(label)}</h2>{(rows as CountRow[]).map((row)=><p key={row.status}>{row.status}: <strong>{row._count}</strong></p>)}<p>Total: <strong>{total(rows as CountRow[])}</strong></p></section>)}</div></>:null}
  </div>;
}
