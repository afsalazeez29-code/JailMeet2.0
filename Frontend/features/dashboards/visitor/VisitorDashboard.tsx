'use client';

import Link from 'next/link';
import { type ComponentType, type SVGProps, useState } from 'react';
import { CalendarCheck, CircleCheck, CircleX, Clock3 } from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import iconStyles from '../../../components/common/LucideIcon.module.css';
import { useDashboard } from '@features/dashboards/services/useDashboard';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getVisitorDashboard } from '@features/dashboards/services/dashboard.service';
import { VisitorDashboardData } from '@features/dashboards/types';
import { formatVisitorPublicId } from '@/lib/visitor-public-id';
import VisitorAppointmentCard from '@features/appointments/components/VisitorAppointmentCard';
import type { AppointmentStatus } from '@features/appointments/types';
import { EmptyStateAlert } from '@components/common/StatusAlert';
import styles from './VisitorDashboard.module.css';

type CardIcon = ComponentType<SVGProps<SVGSVGElement>>;

const statCards = [
  {
    label: 'My Appointments',
    field: 'myAppointments',
    icon: CalendarCheck,
    colorClass: 'bg-label-primary',
    filter: 'ALL',
  },
  {
    label: 'Pending Appointments',
    field: 'pendingAppointments',
    icon: Clock3,
    colorClass: 'bg-label-warning',
    filter: 'PENDING',
  },
  {
    label: 'Approved Appointments',
    field: 'approvedAppointments',
    icon: CircleCheck,
    colorClass: 'bg-label-success',
    filter: 'ACCEPTED',
  },
  {
    label: 'Rejected Appointments',
    field: 'rejectedAppointments',
    icon: CircleX,
    colorClass: 'bg-label-danger',
    filter: 'REJECTED',
  },
] satisfies ReadonlyArray<{
  label: string;
  field: 'myAppointments' | 'pendingAppointments' | 'approvedAppointments' | 'rejectedAppointments';
  icon: CardIcon;
  colorClass: string;
  filter: AppointmentStatus | 'ALL';
}>;

function VisitorStatCard({
  data,
  field,
  icon: Icon,
  colorClass,
  label,
  active,
  onSelect,
}: {
  data: VisitorDashboardData;
  field: 'myAppointments' | 'pendingAppointments' | 'approvedAppointments' | 'rejectedAppointments';
  icon: CardIcon;
  colorClass: string;
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="col-lg-3 col-md-6 col-12 mb-4">
      <button
        aria-pressed={active}
        className={`${styles.statButton} ${active ? styles.active : ''}`}
        onClick={onSelect}
        type="button"
      >
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <div
              className={`avatar flex-shrink-0 ${colorClass} rounded d-flex align-items-center justify-content-center`}
            >
              <Icon
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.card}`}
              />
            </div>
          </div>
          <span className="fw-semibold d-block mb-1">{label}</span>
          <h3 className="card-title mb-2">{data[field] ?? 0}</h3>
        </div>
      </button>
    </div>
  );
}

export default function VisitorDashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState<AppointmentStatus | 'ALL' | null>(null);
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
        <LoadingAlert>Loading visitor dashboard...</LoadingAlert>
      </div>
    );
  }

  if (protectedPage.isForbidden || dashboard.isForbidden) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ForbiddenAlert />
      </div>
    );
  }

  const errorMessage =
    protectedPage.error || dashboard.error || 'Unable to load visitor dashboard';

  if (protectedPage.error || dashboard.error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ErrorAlert>{errorMessage}</ErrorAlert>
      </div>
    );
  }

  const data = dashboard.data;
  const user = protectedPage.user;

  if (!data) {
    return null;
  }

  const selectedCard = statCards.find((card) => card.filter === selectedFilter);
  const filteredAppointments =
    selectedFilter === null || selectedFilter === 'ALL'
      ? data.appointments
      : data.appointments.filter(
          (appointment) => appointment.status === selectedFilter,
        );
  const emptyMessages: Record<AppointmentStatus | 'ALL', string> = {
    ALL: 'You have not booked any appointments yet.',
    PENDING: 'You have no pending appointments.',
    ACCEPTED: 'You have no approved appointments.',
    REJECTED: 'You have no rejected appointments.',
    COMPLETED: 'You have no completed appointments.',
    CANCELLED: 'You have no cancelled appointments.',
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h1>Welcome {user?.name ?? 'Visitor'}</h1>
              <p>
                Your Visitor ID: <strong>{formatVisitorPublicId(data.publicId)}</strong>
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
            active={selectedFilter === card.filter}
            onSelect={() => setSelectedFilter(card.filter)}
          />
        ))}

        {selectedFilter && selectedCard ? (
          <div className="col-12 mb-4">
            <section className="card" aria-live="polite">
              <div className="card-body">
                <div className={`${styles.resultsHeader} mb-3`}>
                  <h2>{selectedCard.label} — {filteredAppointments.length}</h2>
                  <Link className="btn btn-outline-primary" href="/visitor/appointments">
                    Full booking status
                  </Link>
                </div>
                {filteredAppointments.length ? (
                  <div className={styles.results}>
                    {filteredAppointments.map((appointment) => (
                      <VisitorAppointmentCard appointment={appointment} compact key={appointment.id} />
                    ))}
                  </div>
                ) : (
                  <EmptyStateAlert>
                    {emptyMessages[selectedFilter]}
                    {selectedFilter === 'ALL' ? (
                      <> <Link className="alert-link" href="/visitor/appointments/book">Book an appointment</Link>.</>
                    ) : null}
                  </EmptyStateAlert>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
