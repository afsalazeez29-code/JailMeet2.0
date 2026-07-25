'use client';

import Link from 'next/link';
import { type ComponentType, type SVGProps } from 'react';
import {
  CalendarDays,
  CircleCheck,
  Clock3,
  FileText,
  UserCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert, StatusAlert } from '../../../components/common/StatusAlert';
import iconStyles from '../../../components/common/LucideIcon.module.css';
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
    iconClass: 'icon-primary',
    href: '/admin/users',
  },
  {
    label: 'Visitors',
    field: 'totalVisitors',
    icon: UserCheck,
    iconClass: 'icon-info',
    href: '/admin/visitors',
  },
  {
    label: 'Officers',
    field: 'totalOfficers',
    icon: UserRound,
    iconClass: 'icon-success',
    href: '/admin/officers',
  },
  {
    label: 'Prisoners',
    field: 'totalPrisoners',
    icon: UserRound,
    iconClass: 'icon-secondary',
    href: '/admin/prisoners',
  },
  {
    label: 'Appointments',
    field: 'totalAppointments',
    icon: CalendarDays,
    iconClass: 'icon-primary',
    href: '/admin/appointments',
  },
  {
    label: 'Pending Appointments',
    field: 'pendingAppointments',
    icon: CircleCheck,
    iconClass: 'icon-info',
    href: '/admin/appointments?status=PENDING',
  },
  {
    label: 'Pending Parole Requests',
    field: 'pendingParoleRequests',
    icon: FileText,
    iconClass: 'icon-warning',
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
      <Link href={href} className="card card-stats card-round text-decoration-none">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-icon">
              <div
                className={`icon-big text-center ${iconClass} bubble-shadow-small`}
              >
                <Icon
                  aria-hidden="true"
                  className={`${iconStyles.icon} ${iconStyles.card}`}
                />
              </div>
            </div>
            <div className="col col-stats ms-3 ms-sm-0">
              <div className="numbers">
                <p className="card-category">{label}</p>
                <h4 className="card-title">{data[field] ?? 0}</h4>
              </div>
            </div>
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
      <div className="container" style={{ position: 'absolute', top: '70px' }}>
        <div className="page-inner">
          <LoadingAlert>Loading admin dashboard...</LoadingAlert>
        </div>
      </div>
    );
  }

  if (protectedPage.isForbidden || dashboard.isForbidden) {
    return (
      <div className="container" style={{ position: 'absolute', top: '70px' }}>
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
      <div className="container" style={{ position: 'absolute', top: '70px' }}>
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
    <div className="container" style={{ position: 'absolute', top: '70px' }}>
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
