import { ReactNode } from 'react';

import AdminLayout from '../../components/legacy/admin/AdminLayout';

type AdminRouteLayoutProps = {
  children: ReactNode;
};

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
