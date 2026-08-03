'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  CalendarDays,
  FileHeart,
  FileText,
  LifeBuoy,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import s from '@components/layouts/admin/AdminTheme.module.css';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getAdminOfficers } from '@features/admin-users/services/admin-users.service';
import { getAdminDashboard } from '@features/dashboards/services/dashboard.service';
import { useDashboard } from '@features/dashboards/services/useDashboard';
import type { AdminDashboardData } from '@features/dashboards/types';

const OFFICER_FALLBACK_IMAGE = '/images/avatars/officer-default.PNG';

const cards: Array<{
  label: string;
  field: keyof AdminDashboardData;
  href: string;
  icon: typeof UsersRound;
}> = [
  { label: 'Active valid accounts', field: 'totalActiveValidAccounts', href: '/admin/users?status=ACTIVE', icon: UsersRound },
  { label: 'Active Visitors with profiles', field: 'activeVisitorsWithProfiles', href: '/admin/visitors', icon: UserCheck },
  { label: 'Active Officers with profiles', field: 'activeOfficersWithProfiles', href: '/admin/officers', icon: UserRound },
  { label: 'Active Prisoners with profiles', field: 'activePrisonersWithProfiles', href: '/admin/prisoners', icon: UserRound },
  { label: 'Unassigned Prisoners', field: 'unassignedPrisoners', href: '/admin/officer-operations?assignment=UNASSIGNED', icon: ShieldAlert },
  { label: 'Pending appointments', field: 'pendingAppointments', href: '/admin/appointments?status=PENDING', icon: CalendarDays },
  { label: 'Pending parole requests', field: 'pendingParoleRequests', href: '/admin/parole?status=PENDING', icon: FileText },
  { label: 'Pending change requests', field: 'pendingChangeRequests', href: '/admin/appointments?section=change-requests&status=PENDING', icon: Activity },
  { label: 'Open Visitor Support', field: 'openVisitorSupport', href: '/admin/support-requests?status=OPEN', icon: LifeBuoy },
  { label: 'Open Prisoner Support', field: 'openPrisonerSupport', href: '/admin/prisoner-support-requests?status=OPEN', icon: LifeBuoy },
  { label: 'Escalated support', field: 'escalatedSupport', href: '/admin/support-escalations', icon: ShieldAlert },
  { label: 'Active Jail Rules', field: 'activeJailRules', href: '/admin/jail-rules?status=ACTIVE', icon: ShieldCheck },
  { label: 'FIR requiring attention', field: 'firRequiringAttention', href: '/admin/fir-records?requiresAttention=true', icon: FileText },
  { label: 'Medical requiring attention', field: 'medicalRequiringAttention', href: '/admin/health-records?requiresAttention=true', icon: FileHeart },
  { label: 'Unread Admin notifications', field: 'unreadAdminNotifications', href: '/admin/dashboard#notifications', icon: Bell },
  { label: 'Data-integrity warnings', field: 'integrityWarnings', href: '/admin/system-integrity', icon: ShieldAlert },
];

const officerImageKey = (publicId: string | null, name: string) =>
  publicId ?? `name:${name}`;

export default function AdminDashboardPage() {
  const protectedPage = useProtectedPage();
  const dashboard = useDashboard(getAdminDashboard, {
    enabled: protectedPage.isReady,
    onUnauthenticated: protectedPage.redirectToLogin,
  });
  const [officerImages, setOfficerImages] = useState<Record<string, string | null>>({});

  const loadOfficerImages = useCallback(async () => {
    const images: Record<string, string | null> = {};
    let page = 1;
    let totalPages = 1;

    do {
      const response = await getAdminOfficers({ page, limit: 100 });

      response.items.forEach((officer) => {
        images[officerImageKey(officer.publicId, officer.name)] =
          officer.profilePic?.trim() || null;
      });

      totalPages = response.pagination.totalPages;
      page += 1;
    } while (page <= totalPages);

    return images;
  }, []);

  useEffect(() => {
    if (!protectedPage.isReady) {
      return;
    }

    let isMounted = true;

    void loadOfficerImages()
      .then((images) => {
        if (isMounted) {
          setOfficerImages(images);
        }
      })
      .catch(() => {
        // The dashboard remains usable with the existing public fallback image.
      });

    return () => {
      isMounted = false;
    };
  }, [loadOfficerImages, protectedPage.isReady]);

  const handleRefresh = () => {
    dashboard.reload();
    void loadOfficerImages().then(setOfficerImages).catch(() => undefined);
  };

  if (protectedPage.isLoading || dashboard.isLoading) {
    return <LoadingAlert>Loading Admin dashboard…</LoadingAlert>;
  }

  if (protectedPage.isForbidden || dashboard.isForbidden) {
    return <ForbiddenAlert />;
  }

  if (protectedPage.error || dashboard.error) {
    return (
      <ErrorAlert>
        {protectedPage.error || dashboard.error || 'Unable to load dashboard'}
      </ErrorAlert>
    );
  }

  const data = dashboard.data;

  if (!data) {
    return null;
  }

  const adminName = protectedPage.user?.name?.trim() || 'Admin';
  const adminRole = protectedPage.user?.role ?? 'ADMIN';
  const adminEmail = protectedPage.user?.email?.trim() || 'Email unavailable';

  return (
    <div className="admin-dashboard-page">
      <div className="page-inner">
        <section className={s.welcomeCard} aria-labelledby="admin-welcome-heading">
          <h1 id="admin-welcome-heading">Welcome {adminName}</h1>
          <p>{adminRole}</p>
          <p>{adminEmail}</p>
          <button
            aria-label="Refresh dashboard"
            className={s.adminIconButton}
            disabled={dashboard.isLoading}
            onClick={handleRefresh}
            title="Refresh dashboard"
            type="button"
          >
            <RefreshCw aria-hidden="true" size={18} />
          </button>
        </section>

        <div className="row g-3 mt-1">
          {cards.map(({ field, href, icon: Icon, label }) => (
            <div className="col-12 col-sm-6 col-lg-3" key={String(field)}>
              <Link className="text-decoration-none" href={href}>
                <article className={`${s.statCard} ${s.statCardInteractive}`}>
                  <div className={s.statCardBody}>
                    <Icon aria-hidden="true" size={22} />
                    <span className={s.statTitle}>{label}</span>
                    <h3 className={s.statValue}>
                      {typeof data[field] === 'number' ? data[field] : 0}
                    </h3>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>

        <section className={`${s.summaryCard} mt-4`}>
          <h4>Operational Summary</h4>
          <div className="row g-3">
            <div className="col-md-4">
              <strong>Support requiring response</strong>
              <div>{data.operationalSummary.supportRequiringResponse}</div>
            </div>
            <div className="col-md-4">
              <strong>Overdue medical follow-ups</strong>
              <div>{data.operationalSummary.overdueMedicalFollowUps}</div>
            </div>
            <div className="col-md-4">
              <strong>Recent security warnings</strong>
              <div>{data.operationalSummary.recentSecurityWarnings}</div>
            </div>
          </div>

          <h5 className="mt-4">Officer Workload</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Officer</th>
                  <th>Public ID</th>
                  <th>Assigned Prisoners</th>
                </tr>
              </thead>
              <tbody>
                {data.operationalSummary.officerWorkload.map((item) => {
                  const image = officerImages[
                    officerImageKey(item.publicId, item.name)
                  ];

                  return (
                    <tr key={item.publicId ?? item.name}>
                      <td>
                        <div className={s.officerIdentity}>
                          <img
                            alt={`${item.name} profile`}
                            className={s.officerWorkloadAvatar}
                            onError={(event) => {
                              if (event.currentTarget.dataset.fallbackApplied) {
                                return;
                              }

                              event.currentTarget.dataset.fallbackApplied = 'true';
                              event.currentTarget.src = OFFICER_FALLBACK_IMAGE;
                            }}
                            src={image || OFFICER_FALLBACK_IMAGE}
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>{item.publicId ?? 'ID unavailable'}</td>
                      <td>{item.assignedPrisoners}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
