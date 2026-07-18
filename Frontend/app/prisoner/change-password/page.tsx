'use client';

import ChangePasswordForm from '../../../components/auth/ChangePasswordForm';
import { useProtectedPage } from '@/hooks/useProtectedPage';

export default function PrisonerChangePasswordPage() {
  const protectedPage = useProtectedPage();
  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <div className="card"><div className="card-body"><div className="alert alert-info mb-0">Loading security settings...</div></div></div>;
  if (protectedPage.isForbidden) return <div className="card"><div className="card-body"><div className="alert alert-danger mb-0">Access denied</div></div></div>;
  return <ChangePasswordForm />;
}
