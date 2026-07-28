'use client';

import { ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import ChangePasswordForm from '@features/auth/components/ChangePasswordForm';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';

export default function PrisonerChangePasswordPage() {
  const protectedPage = useProtectedPage();
  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <div className="container-xxl flex-grow-1 container-p-y"><div className="card"><div className="card-body"><LoadingAlert className="mb-0">Loading security settings...</LoadingAlert></div></div></div>;
  if (protectedPage.isForbidden) return <div className="container-xxl flex-grow-1 container-p-y"><div className="card"><div className="card-body"><ForbiddenAlert className="mb-0" /></div></div></div>;
  return <div className="container-xxl flex-grow-1 container-p-y"><ChangePasswordForm /></div>;
}


