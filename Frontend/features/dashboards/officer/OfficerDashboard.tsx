'use client';

import { type ComponentType, type SVGProps, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CalendarCheck, Clock3, FileText, HeartPulse, ListChecks, QrCode, ThumbsUp, UsersRound } from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert, SuccessAlert } from '../../../components/common/StatusAlert';
import iconStyles from '../../../components/common/LucideIcon.module.css';
import s from '../../../components/layouts/officer/OfficerTheme.module.css';
import { useDashboard } from '@features/dashboards/services/useDashboard';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getOfficerDashboard } from '@features/dashboards/services/dashboard.service';
import { OfficerDashboardData } from '@features/dashboards/types';

type CardIcon = ComponentType<SVGProps<SVGSVGElement>>;
type OfficerCountField = Exclude<keyof OfficerDashboardData, 'officer' | 'todaySchedule'>;

const statCards = [
  {
    label: 'Assigned Prisoners', field: 'assignedPrisoners', href: '/officer/prisoners',
    icon: UsersRound,
    colorClass: s.iconPrimary,
  },
  {
    label: 'Pending Appointments', field: 'pendingAppointments', href: '/officer/appointments?status=PENDING',
    icon: Clock3,
    colorClass: s.iconWarning,
  },
  {
    label: 'Approved Upcoming Visits', field: 'approvedAppointments', href: '/officer/appointments?status=ACCEPTED',
    icon: ThumbsUp,
    colorClass: s.iconSuccess,
  },
  {
    label: 'Pending Change Requests', field: 'pendingChangeRequests', href: '/officer/change-requests?status=PENDING', icon: ListChecks, colorClass: s.iconWarning,
  },
  {
    label: 'Pending Parole Requests', field: 'pendingParoleRequests', href: '/officer/parole?status=PENDING',
    icon: Clock3,
    colorClass: s.iconWarning,
  },
  { label: 'Visits Scheduled Today', field: 'visitsToday', href: '/officer/appointments', icon: CalendarCheck, colorClass: s.iconInfo },
  { label: 'Passes Awaiting Verification', field: 'passesAwaitingVerification', href: '/officer/visit-verification', icon: QrCode, colorClass: s.iconInfo },
  { label: 'Open FIR Tasks', field: 'openFirTasks', href: '/officer/fir-records', icon: FileText, colorClass: s.iconDanger },
  { label: 'Medical Actions', field: 'medicalRequestsRequiringAction', href: '/officer/health-records', icon: HeartPulse, colorClass: s.iconDanger },
  { label: 'Unread Notifications', field: 'unreadNotifications', href: '/officer/dashboard', icon: Bell, colorClass: s.iconPrimary },
] satisfies ReadonlyArray<{
  label: string;
  field: OfficerCountField;
  icon: CardIcon;
  colorClass: string;
  href: string;
}>;

function OfficerStatCard({
  colorClass,
  data,
  field,
  icon: Icon,
  label,
  href,
}: {
  colorClass: string;
  data: OfficerDashboardData;
  field: OfficerCountField;
  icon: CardIcon;
  label: string;
  href: string;
}) {
  return (
    <div className="col-lg-3 col-md-6 col-12 mb-4">
      <Link className={`${s.statCard} ${s.statCardInteractive} d-block`} href={href}>
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
      </Link>
    </div>
  );
}

export default function OfficerDashboardPage() {
  const protectedPage = useProtectedPage();
  const dashboard = useDashboard(getOfficerDashboard, {
    enabled: protectedPage.isReady,
    onUnauthenticated: protectedPage.redirectToLogin,
  });
  useEffect(() => {
    const refresh = () => dashboard.reload();
    window.addEventListener('jailmeet:officer-dashboard-refresh', refresh);
    return () => window.removeEventListener('jailmeet:officer-dashboard-refresh', refresh);
  }, [dashboard.reload]);

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
          Officer ID: {data.officer.publicId}
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
            href={card.href}
          />
        ))}
      </div>
      <section className="card-box mb-30"><div className="pd-20"><h2 className="h4 text-blue">Today&apos;s schedule</h2>{data.todaySchedule.length === 0 ? <p className="mb-0">No approved visits scheduled today.</p> : <div className="table-responsive"><table className="table table-striped"><thead><tr><th>Time</th><th>Prisoner</th><th>Visitor</th><th>Pass</th><th>Action</th></tr></thead><tbody>{data.todaySchedule.map((item) => <tr key={item.reference}><td>{new Date(item.requestedDate).toLocaleString()}</td><td>{item.prisoner.name} ({item.prisoner.publicId})</td><td>{item.visitor.name} ({item.visitor.publicId || 'ID unavailable'})</td><td>{item.passStatus || 'Not issued'} {item.expiringSoon ? 'â€” expiring soon' : ''}</td><td><Link className="btn btn-sm btn-outline-primary" href="/officer/visit-verification">Check in</Link></td></tr>)}</tbody></table></div>}</div></section>
    </>
  );
}
