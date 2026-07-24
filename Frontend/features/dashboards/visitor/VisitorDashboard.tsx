'use client';

import { useDashboard } from '@features/dashboards/services/useDashboard';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getVisitorDashboard } from '@features/dashboards/services/dashboard.service';
import { VisitorDashboardData } from '@features/dashboards/types';

const statCards = [
  {
    label: 'My Appointments',
    field: 'myAppointments',
    icon: 'bx-calendar-check',
    colorClass: 'bg-label-primary',
  },
  {
    label: 'Pending Appointments',
    field: 'pendingAppointments',
    icon: 'bx-time-five',
    colorClass: 'bg-label-warning',
  },
  {
    label: 'Approved Appointments',
    field: 'approvedAppointments',
    icon: 'bx-check-circle',
    colorClass: 'bg-label-success',
  },
  {
    label: 'Rejected Appointments',
    field: 'rejectedAppointments',
    icon: 'bx-x-circle',
    colorClass: 'bg-label-danger',
  },
] as const;

function VisitorStatCard({
  data,
  field,
  icon,
  colorClass,
  label,
}: {
  data: VisitorDashboardData;
  field: keyof VisitorDashboardData;
  icon: string;
  colorClass: string;
  label: string;
}) {
  return (
    <div className="col-lg-3 col-md-6 col-12 mb-4">
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <div
              className={`avatar flex-shrink-0 ${colorClass} rounded d-flex align-items-center justify-content-center`}
            >
              <i className={`bx ${icon} fs-3 d-block lh-1`}></i>
            </div>
          </div>
          <span className="fw-semibold d-block mb-1">{label}</span>
          <h3 className="card-title mb-2">{data[field] ?? 0}</h3>
        </div>
      </div>
    </div>
  );
}

export default function VisitorDashboardPage() {
  const protectedPage = useProtectedPage();
  const dashboard = useDashboard(getVisitorDashboard, {
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
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-info">Loading visitor dashboard...</div>
      </div>
    );
  }

  if (protectedPage.isForbidden || dashboard.isForbidden) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger">Access denied</div>
      </div>
    );
  }

  const errorMessage =
    protectedPage.error || dashboard.error || 'Unable to load visitor dashboard';

  if (protectedPage.error || dashboard.error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger">{errorMessage}</div>
      </div>
    );
  }

  const data = dashboard.data;
  const user = protectedPage.user;

  if (!data) {
    return null;
  }

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h1>Welcome {user?.name ?? 'Visitor'}</h1>
              <p>
                Your Visitor ID: <strong>{user?.id ?? ''}</strong>
              </p>
              <p>Email: {user?.email ?? ''}</p>
            </div>
          </div>
        </div>

        {statCards.map((card) => (
          <VisitorStatCard
            colorClass={card.colorClass}
            data={data}
            field={card.field}
            icon={card.icon}
            key={card.field}
            label={card.label}
          />
        ))}
      </div>
    </div>
  );
}
