'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getAdminPrisonerById, updateAdminPrisoner } from '@features/admin-users/services/admin-users.service';
import { isApiServiceError } from '@/types/api';
import { AdminPrisonerDetails, CreatePrisonerInput, UpdatePrisonerInput } from '@features/admin-users/types';
import PrisonerForm from '@features/admin-users/components/PrisonerForm';

export default function EditPrisonerPage() {
  const protectedPage = useProtectedPage();
  const router = useRouter();
  const params = useParams<{ prisonerId: string }>();
  const [prisoner, setPrisoner] = useState<AdminPrisonerDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!protectedPage.isReady || !params.prisonerId) return; let mounted = true;
    const load = async () => { setLoading(true); try { const data = await getAdminPrisonerById(params.prisonerId); if (mounted) setPrisoner(data); } catch (caughtError) { if (mounted) setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to load prisoner'); } finally { if (mounted) setLoading(false); } };
    void load(); return () => { mounted = false; };
  }, [protectedPage.isReady, params.prisonerId]);
  const submit = async (data: CreatePrisonerInput | UpdatePrisonerInput) => {
    setSubmitting(true); setError(null);
    try { await updateAdminPrisoner(params.prisonerId, data as UpdatePrisonerInput); router.push('/admin/prisoners'); }
    catch (caughtError) { setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to update prisoner'); }
    finally { setSubmitting(false); }
  };
  if (protectedPage.isLoading || loading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><div className="alert alert-info">Loading prisoner...</div></Shell>;
  if (protectedPage.isForbidden) return <Shell><div className="alert alert-danger">Access denied</div></Shell>;
  return <Shell><h3 className="fw-bold mb-3">Edit Prisoner</h3>{prisoner ? <PrisonerForm mode="edit" initialValues={{ email: prisoner.user.email ?? '', name: prisoner.name, age: prisoner.age, gender: prisoner.gender, admissionDate: prisoner.admissionDate, caseDetails: prisoner.caseDetails, sentencePeriod: prisoner.sentencePeriod, jailType: prisoner.jailType, jailName: prisoner.jailName, cellNumber: prisoner.cellNumber }} isSubmitting={submitting} error={error || protectedPage.error} onSubmit={submit} /> : <div className="alert alert-danger">{error || 'Prisoner not found'}</div>}</Shell>;
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>; }
