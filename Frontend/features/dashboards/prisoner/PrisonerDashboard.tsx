'use client';

import { type ComponentType, type SVGProps } from 'react';
import { CalendarCheck, CircleCheck, CircleX, Clock3, FileText } from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import iconStyles from '../../../components/common/LucideIcon.module.css';
import themeStyles from '../../../components/layouts/prisoner/PrisonerTheme.module.css';
import { useDashboard } from '@features/dashboards/services/useDashboard';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getPrisonerDashboard } from '@features/dashboards/services/dashboard.service';
import type { PrisonerDashboardData } from '@features/dashboards/types';
import styles from './PrisonerDashboard.module.css';

type CardIcon = ComponentType<SVGProps<SVGSVGElement>>;
type SummaryField = keyof PrisonerDashboardData['summary'];

const statCards = [
  {
    label: 'My Parole Requests',
    field: 'myParoleRequests',
    icon: FileText,
    colorClass: themeStyles.iconPrimary,
  },
  {
    label: 'Pending Parole Requests',
    field: 'pendingParoleRequests',
    icon: Clock3,
    colorClass: themeStyles.iconWarning,
  },
  {
    label: 'Approved Parole Requests',
    field: 'approvedParoleRequests',
    icon: CircleCheck,
    colorClass: themeStyles.iconSuccess,
  },
  {
    label: 'Rejected Parole Requests',
    field: 'rejectedParoleRequests',
    icon: CircleX,
    colorClass: themeStyles.iconDanger,
  },
  {
    label: 'My Appointments',
    field: 'myAppointments',
    icon: CalendarCheck,
    colorClass: themeStyles.iconInfo,
  },
] satisfies ReadonlyArray<{
  label: string;
  field: SummaryField;
  icon: CardIcon;
  colorClass: string;
}>;

function PrisonerStatCard({
  colorClass,
  value,
  icon: Icon,
  label,
}: {
  colorClass: string;
  value: number;
  icon: CardIcon;
  label: string;
}) {
  return (
    <div className="col-xl-3 col-md-6 col-12 mb-4">
      <article className={styles.statCard} aria-label={`${label}: ${value}`}>
        <div className={styles.statCardBody}>
          <div className={`${styles.statIconBox} ${colorClass}`}>
            <Icon
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.card}`}
            />
          </div>
          <h2 className={styles.statTitle}>{label}</h2>
          <p className={styles.statValue}>{value}</p>
        </div>
      </article>
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
      <div className="container-xxl flex-grow-1 container-p-y">
        <LoadingAlert>Loading prisoner dashboard...</LoadingAlert>
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
    protectedPage.error ||
    dashboard.error ||
    'Unable to load prisoner dashboard';

  if (protectedPage.error || dashboard.error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ErrorAlert>{errorMessage}</ErrorAlert>
      </div>
    );
  }

  const data = dashboard.data;
  if (!data) return null;

  return (
    <div className={`container-xxl flex-grow-1 container-p-y ${styles.dashboard}`}>
      <section className={styles.welcomeCard} aria-labelledby="prisoner-welcome-heading">
        <p className={styles.eyebrow}>Prisoner Dashboard</p>
        <h1 className={styles.welcomeTitle} id="prisoner-welcome-heading">
          Welcome, {data.prisoner.name || 'Prisoner'}
        </h1>
        <dl className={styles.identityList}>
          <div>
            <dt>Email</dt>
            <dd>{data.prisoner.email || 'Not provided'}</dd>
          </div>
          <div>
            <dt>Prisoner ID</dt>
            <dd>{data.prisoner.publicId || 'Prisoner ID unavailable'}</dd>
          </div>
        </dl>
        <p className={styles.supportingText}>
          View your parole requests, appointments, and account information.
        </p>
      </section>

      <section aria-labelledby="prisoner-summary-heading">
        <h2 className={styles.sectionTitle} id="prisoner-summary-heading">
          Activity Summary
        </h2>
        <div className="row">
          {statCards.map((card) => (
            <PrisonerStatCard
              colorClass={card.colorClass}
              icon={card.icon}
              key={card.field}
              label={card.label}
              value={data.summary[card.field] ?? 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
