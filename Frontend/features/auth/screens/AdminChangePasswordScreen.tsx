'use client';

import { ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import ChangePasswordForm from '@features/auth/components/ChangePasswordForm';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';

export default function AdminChangePasswordPage() {
  const protectedPage = useProtectedPage();
  if (protectedPage.isLoading || (!protectedPage.isReady && !protectedPage.error && !protectedPage.isForbidden)) return <Shell><LoadingAlert>Loading security settings...</LoadingAlert></Shell>;
  if (protectedPage.isForbidden) return <Shell><ForbiddenAlert /></Shell>;
  return <Shell><ChangePasswordForm /></Shell>;
}
function Shell({ children }: { children: React.ReactNode }) { return <div className="container" style={{ position: 'absolute', top: '70px' }}><div className="page-inner">{children}</div></div>; }


