'use client';

import Link from 'next/link';
import { type ComponentType, type SVGProps } from 'react';
import {
  CalendarDays,
  CircleCheck,
  FileText,
  UserCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert, StatusAlert } from '../../../components/common/StatusAlert';
import iconStyles from '../../../components/common/LucideIcon.module.css';
import s from '../../../components/layouts/admin/AdminTheme.module.css';
import { useDashboard } from '@features/dashboards/services/useDashboard';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getAdminDashboard } from '@features/dashboards/services/dashboard.service';
import { AdminDashboardData } from '@features/dashboards/types';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';

type CardIcon = ComponentType<SVGProps<SVGSVGElement>>;

const statCards = [
  {
    label: 'Total Users',
    field: 'totalUsers',
    icon: UsersRound,
    iconClass: s.iconPrimary,
    href: '/admin/users',
  },
  {
    label: 'Visitors',
    field: 'totalVisitors',
    icon: UserCheck,
    iconClass: s.iconInfo,
    href: '/admin/visitors',
  },
  {
    label: 'Officers',
    field: 'totalOfficers',
    icon: UserRound,
    iconClass: s.iconSuccess,
    href: '/admin/officers',
  },
  {
    label: 'Prisoners',
    field: 'totalPrisoners',
    icon: UserRound,
    iconClass: s.iconPrimary,
    href: '/admin/prisoners',
  },
  {
    label: 'Appointments',
    field: 'totalAppointments',
    icon: CalendarDays,
    iconClass: s.iconPrimary,
    href: '/admin/appointments',
  },
  {
    label: 'Pending Appointments',
    field: 'pendingAppointments',
    icon: CircleCheck,
    iconClass: s.iconWarning,
    href: '/admin/appointments?status=PENDING',
  },
  {
    label: 'Pending Parole Requests',
    field: 'pendingParoleRequests',
    icon: FileText,
    iconClass: s.iconWarning,
    href: '/admin/parole?status=PENDING',
  },
] satisfies ReadonlyArray<{
  label: string;
  field: keyof AdminDashboardData;
  icon: CardIcon;
  iconClass: string;
  href: string;
}>;

function AdminStatCard({
  data,
  field,
  icon: Icon,
  iconClass,
  label,
  href,
}: {
  data: AdminDashboardData;
  field: keyof AdminDashboardData;
  icon: CardIcon;
  iconClass: string;
  label: string;
  href: string;
}) {
  return (
    <div className="col-sm-6 col-md-3">
      <Link href={href} className="text-decoration-none">
        <div className={`${s.statCard} ${s.statCardInteractive}`}>
          <div className={s.statCardBody}>
            <div className={`${s.statIconBox} ${iconClass}`}>
              <Icon
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.card}`}
              />
            </div>
            <span className={s.statTitle}>{label}</span>
            <h3 className={s.statValue}>{data[field] ?? 0}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function AdminDashboardPage() {
  const protectedPage = useProtectedPage();
  const dashboard = useDashboard(getAdminDashboard, {
    enabled: protectedPage.isReady,
    onUnauthenticated: protectedPage.redirectToLogin,
  });

  if (
    protectedPage.isLoading ||
    dashboard.isLoading ||
    (!protectedPage.isReady &&
      !protectedPage.isForbidden &&
      !protectedPage.error)
  ) {
    return (
      <div className="admin-dashboard-page">
        <div className="page-inner">
          <LoadingAlert>Loading admin dashboard...</LoadingAlert>
        </div>
      </div>
    );
  }

  if (protectedPage.isForbidden || dashboard.isForbidden) {
    return (
      <div className="admin-dashboard-page">
        <div className="page-inner">
          <ForbiddenAlert />
        </div>
      </div>
    );
  }

  const errorMessage =
    protectedPage.error || dashboard.error || 'Unable to load dashboard';

  if (protectedPage.error || dashboard.error) {
    return (
      <div className="admin-dashboard-page">
        <div className="page-inner">
          <ErrorAlert>{errorMessage}</ErrorAlert>
        </div>
      </div>
    );
  }

  const data = dashboard.data;
  const user = protectedPage.user;

  if (!data) {
    return null;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="page-inner">
        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
          <div>
            <h3 className="fw-bold mb-3">Dashboard</h3>
            <h6 className="op-7 mb-2">Admin Dashboard</h6>
          </div>
          <div className="ms-md-auto py-2 py-md-0">
            <Link
              href="/admin/officers"
              className="btn btn-label-info btn-round me-2"
              data-legacy-href="officersdetails.php"
            >
              Add Officer
            </Link>
            <Link
              href="/admin/visitors"
              className="btn btn-primary btn-round"
              data-legacy-href="userdetails.php"
            >
              <AnimatedButtonText>Add Visitor</AnimatedButtonText>
            </Link>
          </div>
        </div>

        <StatusAlert variant="info">Welcome, Admin ID: <strong>{user?.id ?? ''}</strong></StatusAlert>

        <div className="row">
          {statCards.map((card) => (
            <AdminStatCard
              data={data}
              field={card.field}
              icon={card.icon}
              iconClass={card.iconClass}
              href={card.href}
              key={card.field}
              label={card.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
