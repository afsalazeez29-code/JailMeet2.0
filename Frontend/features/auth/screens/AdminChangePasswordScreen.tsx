'use client';

import ChangePasswordForm from '@features/auth/components/ChangePasswordForm';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';

export default function AdminChangePasswordPage() {
  const protectedPage = useProtectedPage();
  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><div className="alert alert-info">Loading security settings...</div></Shell>;
  if (protectedPage.isForbidden) return <Shell><div className="alert alert-danger">Access denied</div></Shell>;
  return <Shell><ChangePasswordForm /></Shell>;
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>; }
