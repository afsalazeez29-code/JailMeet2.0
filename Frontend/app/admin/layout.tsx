import { ReactNode } from 'react';

import AdminLayout from '../../components/layouts/admin/AdminLayout';
import RoleGuard from '@features/auth/components/RoleGuard';

type AdminRouteLayoutProps = {
  children: ReactNode;
};

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return (
    <RoleGuard expectedRole="ADMIN">
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
