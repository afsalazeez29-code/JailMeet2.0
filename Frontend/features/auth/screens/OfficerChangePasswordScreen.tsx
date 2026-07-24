'use client';

import ChangePasswordForm from '@features/auth/components/ChangePasswordForm';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';

export default function OfficerChangePasswordPage() {
  const protectedPage = useProtectedPage();
  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <div className="pd-20"><div className="alert alert-info">Loading security settings...</div></div>;
  if (protectedPage.isForbidden) return <div className="pd-20"><div className="alert alert-danger">Access denied</div></div>;
  return <div className="pd-20"><ChangePasswordForm /></div>;
}
