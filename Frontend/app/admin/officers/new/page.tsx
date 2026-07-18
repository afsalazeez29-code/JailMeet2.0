'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useProtectedPage } from '@/hooks/useProtectedPage';
import { createAdminOfficer } from '@/services/admin.service';
import { isApiServiceError } from '@/types/api';
import { CreateOfficerInput, UpdateOfficerInput } from '@/types/admin';
import OfficerForm from '../../../../components/admin/OfficerForm';

export default function NewOfficerPage() {
  const protectedPage = useProtectedPage();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: CreateOfficerInput | UpdateOfficerInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await createAdminOfficer(data as CreateOfficerInput);
      router.push('/admin/officers');
    } catch (caughtError) {
      setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to create officer');
    } finally {
      setSubmitting(false);
    }
  };

  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><div className="alert alert-info">Loading form...</div></Shell>;
  if (protectedPage.isForbidden) return <Shell><div className="alert alert-danger">Access denied</div></Shell>;
  return <Shell><h3 className="fw-bold mb-3">Create Officer</h3><OfficerForm mode="create" isSubmitting={submitting} error={error || protectedPage.error} onSubmit={submit} /></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>;
}
