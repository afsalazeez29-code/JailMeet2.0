'use client';

import { ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import ChangePasswordForm from '@features/auth/components/ChangePasswordForm';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';

export default function VisitorChangePasswordPage() {
  const protectedPage = useProtectedPage();
  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <div className="container-xxl flex-grow-1 container-p-y"><LoadingAlert>Loading security settings...</LoadingAlert></div>;
  if (protectedPage.isForbidden) return <div className="container-xxl flex-grow-1 container-p-y"><ForbiddenAlert /></div>;
  return <div className="container-xxl flex-grow-1 container-p-y"><ChangePasswordForm /></div>;
}


