'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getAdminOfficerById, updateAdminOfficer } from '@features/admin-users/services/admin-users.service';
import { isApiServiceError } from '@/types/api';
import { AdminOfficerDetails, CreateOfficerInput, UpdateOfficerInput } from '@features/admin-users/types';
import OfficerForm from '@features/admin-users/components/OfficerForm';

export default function EditOfficerPage() {
  const protectedPage = useProtectedPage();
  const router = useRouter();
  const params = useParams<{ officerId: string }>();
  const [officer, setOfficer] = useState<AdminOfficerDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!protectedPage.isReady || !params.officerId) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAdminOfficerById(params.officerId);
        if (mounted) setOfficer(data);
      } catch (caughtError) {
        if (mounted) setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to load officer');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [protectedPage.isReady, params.officerId]);

  const submit = async (data: CreateOfficerInput | UpdateOfficerInput) => {
    setSubmitting(true);
    setError(null);
    try {
      await updateAdminOfficer(params.officerId, data as UpdateOfficerInput);
      router.push('/admin/officers');
    } catch (caughtError) {
      setError(isApiServiceError(caughtError) ? caughtError.message : 'Unable to update officer');
    } finally {
      setSubmitting(false);
    }
  };

  if (protectedPage.isLoading || loading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><LoadingAlert>Loading officer...</LoadingAlert></Shell>;
  if (protectedPage.isForbidden) return <Shell><ForbiddenAlert /></Shell>;
  return <Shell><h3 className="fw-bold mb-3">Edit Officer</h3>{officer ? <OfficerForm mode="edit" initialValues={{ email: officer.user.email ?? '', name: officer.name, phone: officer.phone ?? '' }} isSubmitting={submitting} error={error || protectedPage.error} onSubmit={submit} /> : <ErrorAlert>{error || 'Officer not found'}</ErrorAlert>}</Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>;
}


