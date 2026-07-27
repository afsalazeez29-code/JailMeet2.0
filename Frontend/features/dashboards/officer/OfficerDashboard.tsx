'use client';

import { type ComponentType, type SVGProps } from 'react';
import { CircleX, Clock3, ThumbsUp, UsersRound } from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '../../../components/common/StatusAlert';
import iconStyles from '../../../components/common/LucideIcon.module.css';
import s from '../../../components/layouts/officer/OfficerTheme.module.css';
import { useDashboard } from '@features/dashboards/services/useDashboard';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getOfficerDashboard } from '@features/dashboards/services/dashboard.service';
import { OfficerDashboardData } from '@features/dashboards/types';

type CardIcon = ComponentType<SVGProps<SVGSVGElement>>;

const statCards = [
  {
    label: 'Total Prisoners',
    field: 'totalPrisoners',
    icon: UsersRound,
    colorClass: s.iconPrimary,
  },
  {
    label: 'Pending Appointments',
    field: 'pendingAppointments',
    icon: Clock3,
    colorClass: s.iconWarning,
  },
  {
    label: 'Approved Appointments',
    field: 'approvedAppointments',
    icon: ThumbsUp,
    colorClass: s.iconSuccess,
  },
  {
    label: 'Rejected Appointments',
    field: 'rejectedAppointments',
    icon: CircleX,
    colorClass: s.iconDanger,
  },
  {
    label: 'Pending Parole Requests',
    field: 'pendingParoleRequests',
    icon: Clock3,
    colorClass: s.iconWarning,
  },
] satisfies ReadonlyArray<{
  label: string;
  field: keyof OfficerDashboardData;
  icon: CardIcon;
  colorClass: string;
}>;

function OfficerStatCard({
  colorClass,
  data,
  field,
  icon: Icon,
  label,
}: {
  colorClass: string;
  data: OfficerDashboardData;
  field: keyof OfficerDashboardData;
  icon: CardIcon;
  label: string;
}) {
  return (
    <div className="col-lg-3 col-md-6 col-12 mb-4">
      <div className={s.statCard}>
        <div className={s.statCardBody}>
          <div className={`${s.statIconBox} ${colorClass}`}>
            <Icon
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.card}`}
            />
          </div>
          <span className={s.statTitle}>{label}</span>
          <h3 className={s.statValue}>{data[field] ?? 0}</h3>
        </div>
      </div>
    </div>
  );
}

export default function OfficerDashboardPage() {
  const protectedPage = useProtectedPage();
  const dashboard = useDashboard(getOfficerDashboard, {
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
      <div className="pd-20">
        <LoadingAlert>Loading officer dashboard...</LoadingAlert>
      </div>
    );
  }

  if (protectedPage.isForbidden || dashboard.isForbidden) {
    return (
      <div className="pd-20">
        <ForbiddenAlert />
      </div>
    );
  }

  const errorMessage =
    protectedPage.error || dashboard.error || 'Unable to load officer dashboard';

  if (protectedPage.error || dashboard.error) {
    return (
      <div className="pd-20">
        <ErrorAlert>{errorMessage}</ErrorAlert>
      </div>
    );
  }

  const data = dashboard.data;
  const user = protectedPage.user;

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="pd-20">
        <SuccessAlert>
          Welcome, {user?.name ?? 'Officer'}!
          <br />
          Email: {user?.email ?? ''}
          <br />
          Officer ID: {user?.id ?? ''}
        </SuccessAlert>
      </div>

      <div className="row">
        {statCards.map((card) => (
          <OfficerStatCard
            colorClass={card.colorClass}
            data={data}
            field={card.field}
            icon={card.icon}
            key={card.field}
            label={card.label}
          />
        ))}
      </div>
    </>
  );
}
