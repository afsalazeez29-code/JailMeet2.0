'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { createAdminPrisoner } from '@features/admin-users/services/admin-users.service';
import { isApiServiceError } from '@/types/api';
import { CreatePrisonerInput, UpdatePrisonerInput } from '@features/admin-users/types';
import PrisonerForm from '@features/admin-users/components/PrisonerForm';

export default function NewPrisonerPage() {
  const protectedPage = useProtectedPage();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (data: CreatePrisonerInput | UpdatePrisonerInput) => {
    setSubmitting(true); setError(null);
    try { await createAdminPrisoner(data as CreatePrisonerInput); router.push('/admin/prisoners'); }
    catch (caughtError) { setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to create prisoner'); }
    finally { setSubmitting(false); }
  };
  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><div className="alert alert-info">Loading form...</div></Shell>;
  if (protectedPage.isForbidden) return <Shell><div className="alert alert-danger">Access denied</div></Shell>;
  return <Shell><h3 className="fw-bold mb-3">Create Prisoner</h3><PrisonerForm mode="create" isSubmitting={submitting} error={error || protectedPage.error} onSubmit={submit} /></Shell>;
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>; }
