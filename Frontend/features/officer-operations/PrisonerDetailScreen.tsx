'use client';
import { useEffect, useState } from 'react';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { EmptyStateAlert, ErrorAlert, LoadingAlert } from '@components/common/StatusAlert';
import { officerGet } from './service';
import { isApiServiceError } from '@/types/api';

export default function PrisonerDetailScreen({ publicId }: { publicId: string }) {
  const auth = useProtectedPage(); const [data, setData] = useState<Record<string, any> | null>(null); const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (auth.isReady) officerGet<Record<string, any>>(`/officer/prisoners/${encodeURIComponent(publicId)}`).then(setData).catch((e) => setError(isApiServiceError(e) ? e.message : 'Unable to load prisoner')); }, [auth.isReady, publicId]);
  if (auth.isLoading || (!data && !error)) return <div className="pd-20"><LoadingAlert>Loading prisoner details...</LoadingAlert></div>;
  if (error) return <div className="pd-20"><ErrorAlert>{error}</ErrorAlert></div>;
  if (!data) return <EmptyStateAlert>Prisoner not found.</EmptyStateAlert>;
  const section = (title: string, values: Array<[string, unknown]>) => <section className="card mb-3"><div className="card-body"><h2 className="h5">{title}</h2>{values.map(([label, value]) => <p className="mb-2" key={label}><strong>{label}:</strong> {value === null || value === undefined ? 'â€”' : String(value)}</p>)}</div></section>;
  return <div className="pd-20"><h1 className="h3 mb-3">{data.name} <small className="text-muted">{data.publicId}</small></h1><div className="row"><div className="col-lg-6">{section('Personal information', [['Name', data.name], ['Public ID', data.publicId], ['Age', data.age], ['Gender', data.gender], ['Nationality', data.nationality]])}{section('Custody information', [['Jail', data.jailName], ['Jail type', data.jailType], ['Cell', data.cellNumber], ['Admission', data.admissionDate], ['Account active', data.user?.isActive ? 'Yes' : 'No']])}{section('Case and sentence', [['Case details', data.caseDetails], ['Sentence', data.sentencePeriod]])}</div><div className="col-lg-6">{section('Operational summaries', [['Upcoming / recent visits', data.appointments?.length ?? 0], ['Parole requests', data.paroleRequests?.length ?? 0], ['FIR records', data.firRecords?.length ?? 0], ['Authorized health summaries', data.medicalSummary?.length ?? 'Restricted']])}</div></div></div>;
}
