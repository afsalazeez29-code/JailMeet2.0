'use client';

import { ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import ChangePasswordForm from '@features/auth/components/ChangePasswordForm';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';

export default function OfficerChangePasswordPage() {
  const protectedPage = useProtectedPage();
  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <div className="pd-20"><LoadingAlert>Loading security settings...</LoadingAlert></div>;
  if (protectedPage.isForbidden) return <div className="pd-20"><ForbiddenAlert /></div>;
  return <div className="pd-20"><ChangePasswordForm /></div>;
}


