'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '../../../components/common/StatusAlert';
import { useDashboard } from '@features/dashboards/services/useDashboard';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getOfficerDashboard } from '@features/dashboards/services/dashboard.service';
import { OfficerDashboardData } from '@features/dashboards/types';

const statCards = [
  {
    label: 'Total Prisoners',
    field: 'totalPrisoners',
    icon: 'dw dw-user-12',
    cardClass: 'bg-primary text-white',
  },
  {
    label: 'Pending Appointments',
    field: 'pendingAppointments',
    icon: 'fa fa-hourglass-half',
    cardClass: 'bg-info text-white',
  },
  {
    label: 'Approved Appointments',
    field: 'approvedAppointments',
    icon: 'fa fa-thumbs-up',
    cardClass: 'bg-secondary text-white',
  },
  {
    label: 'Rejected Appointments',
    field: 'rejectedAppointments',
    icon: 'fa fa-times-circle',
    cardClass: 'bg-danger text-white',
  },
  {
    label: 'Pending Parole Requests',
    field: 'pendingParoleRequests',
    icon: 'fa fa-clock-o',
    cardClass: 'bg-warning text-dark',
  },
] as const;

function OfficerStatCard({
  cardClass,
  data,
  field,
  icon,
  label,
}: {
  cardClass: string;
  data: OfficerDashboardData;
  field: keyof OfficerDashboardData;
  icon: string;
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
          <div className="progress-data">
            <i className={`${icon} fa-3x opacity-50`}></i>
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






