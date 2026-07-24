'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import { useDashboard } from '@features/dashboards/services/useDashboard';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getPrisonerDashboard } from '@features/dashboards/services/dashboard.service';
import { PrisonerDashboardData } from '@features/dashboards/types';

const fallbackPrisonerImage = '/images/avatars/prisoner-fallback.png';

const statCards = [
  {
    label: 'My Parole Requests',
    field: 'myParoleRequests',
    icon: 'zmdi zmdi-assignment',
    colorClass: 'bg-primary',
  },
  {
    label: 'Pending Parole Requests',
    field: 'pendingParoleRequests',
    icon: 'zmdi zmdi-time',
    colorClass: 'bg-warning',
  },
  {
    label: 'Approved Parole Requests',
    field: 'approvedParoleRequests',
    icon: 'zmdi zmdi-check-circle',
    colorClass: 'bg-success',
  },
  {
    label: 'Rejected Parole Requests',
    field: 'rejectedParoleRequests',
    icon: 'zmdi zmdi-close-circle',
    colorClass: 'bg-danger',
  },
  {
    label: 'My Appointments',
    field: 'myAppointments',
    icon: 'zmdi zmdi-calendar-check',
    colorClass: 'bg-info',
  },
] as const;

function PrisonerStatCard({
  colorClass,
  data,
  field,
  icon,
  label,
}: {
  colorClass: string;
  data: PrisonerDashboardData;
  field: keyof PrisonerDashboardData;
  icon: string;
  label: string;
}) {
  return (
    <div className="col-12 col-lg-6 col-xl-3">
      <div className={`card ${colorClass}`}>
        <div className="card-body">
          <div className="media align-items-center">
            <div className="media-body">
              <p className="text-white mb-0">{label}</p>
              <h4 className="text-white mb-0">{data[field] ?? 0}</h4>
            </div>
            <div className="w-icon">
              <i className={`${icon} text-white`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrisonerDashboardPage() {
  const protectedPage = useProtectedPage();
  const dashboard = useDashboard(getPrisonerDashboard, {
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
      <div className="card">
        <div className="card-body">
          <LoadingAlert className="mb-0">Loading prisoner dashboard...</LoadingAlert>
        </div>
      </div>
    );
  }

  if (protectedPage.isForbidden || dashboard.isForbidden) {
    return (
      <div className="card">
        <div className="card-body">
          <ForbiddenAlert className="mb-0" />
        </div>
      </div>
    );
  }

  const errorMessage =
    protectedPage.error ||
    dashboard.error ||
    'Unable to load prisoner dashboard';

  if (protectedPage.error || dashboard.error) {
    return (
      <div className="card">
        <div className="card-body">
          <ErrorAlert className="mb-0">{errorMessage}</ErrorAlert>
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
    <>
      <div className="card">
        <div className="card-header">
          <h5>Prisoner Profile</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="prisoner-photo mb-4">
                <img
                  src={fallbackPrisonerImage}
                  alt="Prisoner profile placeholder"
                  className="img-thumbnail"
                  style={{ maxHeight: '300px' }}
                />
              </div>
              <div className="prisoner-id">
                <h4 className="text-primary">ID: {user?.id ?? ''}</h4>
              </div>
            </div>

            <div className="col-md-8">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Full Name</th>
                      <td>{user?.name ?? 'Prisoner'}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{user?.email ?? ''}</td>
                    </tr>
                    <tr>
                      <th>Role</th>
                      <td>
                        <span className="badge badge-primary">
                          {user?.role ?? 'PRISONER'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Parole Summary</th>
                      <td>
                        <span className="badge badge-warning mr-2">
                          Pending: {data.pendingParoleRequests ?? 0}
                        </span>
                        <span className="badge badge-success mr-2">
                          Approved: {data.approvedParoleRequests ?? 0}
                        </span>
                        <span className="badge badge-danger">
                          Rejected: {data.rejectedParoleRequests ?? 0}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Visitation Status</th>
                      <td>
                        <span className="badge badge-info">
                          Appointments: {data.myAppointments ?? 0}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="additional-info mt-4">
                <h5 className="mb-3">Dashboard Summary</h5>
                <p className="text-muted mb-0">
                  Profile-only fields from the old PHP dashboard, such as age,
                  crime, jail name, FIR details, medical records, cell block,
                  and visitor names/dates, are not shown because the current
                  backend dashboard API does not provide them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        {statCards.map((card) => (
          <PrisonerStatCard
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


