'use client';

import { type ComponentType, type SVGProps } from 'react';
import { CircleX, Clock3, ThumbsUp, UsersRound } from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '../../../components/common/StatusAlert';
import iconStyles from '../../../components/common/LucideIcon.module.css';
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
    cardClass: 'bg-primary text-white',
  },
  {
    label: 'Pending Appointments',
    field: 'pendingAppointments',
    icon: Clock3,
    cardClass: 'bg-info text-white',
  },
  {
    label: 'Approved Appointments',
    field: 'approvedAppointments',
    icon: ThumbsUp,
    cardClass: 'bg-secondary text-white',
  },
  {
    label: 'Rejected Appointments',
    field: 'rejectedAppointments',
    icon: CircleX,
    cardClass: 'bg-danger text-white',
  },
  {
    label: 'Pending Parole Requests',
    field: 'pendingParoleRequests',
    icon: Clock3,
    cardClass: 'bg-warning text-dark',
  },
] satisfies ReadonlyArray<{
  label: string;
  field: keyof OfficerDashboardData;
  icon: CardIcon;
  cardClass: string;
}>;

function OfficerStatCard({
  cardClass,
  data,
  field,
  icon: Icon,
  label,
}: {
  cardClass: string;
  data: OfficerDashboardData;
  field: keyof OfficerDashboardData;
  icon: CardIcon;
  label: string;
}) {
  return (
    <div className="col-xl-3 mb-30">
      <div className={`card-box height-100-p widget-style1 ${cardClass}`}>
        <div className="d-flex flex-wrap align-items-center">
          <div className="widget-data">
            <div className="h4 mb-0">{data[field] ?? 0}</div>
            <div className="weight-600 font-14">{label}</div>
          </div>
          <div className="progress-data opacity-50">
            <Icon
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.card}`}
            />
          </div>
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
            cardClass={card.cardClass}
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
