'use client';

import { type ReactNode, useEffect, useState } from 'react';

import {
  EmptyStateAlert,
  ErrorAlert,
  ForbiddenAlert,
  LoadingAlert,
} from '@components/common/StatusAlert';
import { isApiServiceError } from '@/types/api';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getPrisonerProfile } from '@features/prisoner-profile/services/prisoner-profile.service';
import type { PrisonerProfileData } from '@features/prisoner-profile/types';
import styles from './PrisonerProfileScreen.module.css';

const fallbackPrisonerImage = '/images/avatars/prisoner-default.png';
const notProvided = 'Not provided';

const displayValue = (value: string | number | null | undefined): string =>
  value === null || value === undefined || value === ''
    ? notProvided
    : String(value);

const formatDate = (value: string | null): string => {
  if (!value) return notProvided;
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return notProvided;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

function ProfileImage({ name, src }: { name: string; src: string | null }) {
  const [imageSrc, setImageSrc] = useState(src || fallbackPrisonerImage);

  useEffect(() => {
    setImageSrc(src || fallbackPrisonerImage);
  }, [src]);

  return (
    <img
      alt={`${name} profile`}
      className={styles.profileImage}
      onError={() => setImageSrc(fallbackPrisonerImage)}
      src={imageSrc}
    />
  );
}

function DetailCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className={styles.detailCard}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function DetailGrid({
  items,
}: {
  items: Array<{ label: string; value: string | number | null | undefined }>;
}) {
  return (
    <dl className={styles.detailGrid}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{displayValue(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function PrisonerProfileScreen() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [profile, setProfile] = useState<PrisonerProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    let active = true;
    setLoading(true);
    setError(null);

    getPrisonerProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((caught) => {
        if (!active) return;
        if (isApiServiceError(caught) && caught.status === 401) {
          redirectToLogin();
          return;
        }
        setError(
          isApiServiceError(caught) && caught.status === 403
            ? 'Access denied'
            : 'Unable to load prisoner profile',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isReady, redirectToLogin]);

  if (
    protectedPage.isLoading ||
    loading ||
    (!isReady && !protectedPage.error && !protectedPage.isForbidden)
  ) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <LoadingAlert>Loading profile...</LoadingAlert>
      </div>
    );
  }

  if (protectedPage.isForbidden || error === 'Access denied') {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ForbiddenAlert />
      </div>
    );
  }

  if (protectedPage.error || error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ErrorAlert>{protectedPage.error || error}</ErrorAlert>
      </div>
    );
  }

  if (!profile) return null;

  const publicId = profile.account.publicId || 'Prisoner ID unavailable';

  return (
    <div className={`container-xxl flex-grow-1 container-p-y ${styles.profilePage}`}>
      <header className={styles.pageHeader}>
        <p>Prisoner Account</p>
        <h1>My Profile</h1>
        <span>Your custody and account information is read-only.</span>
      </header>

      <section className={styles.profileHero} aria-labelledby="profile-name">
        <ProfileImage name={profile.account.name} src={profile.account.profilePic} />
        <div className={styles.profileSummary}>
          <h2 id="profile-name">{profile.account.name}</h2>
          <p className={styles.publicId}>{publicId}</p>
          <div className={styles.badges}>
            <span className={styles.roleBadge}>{profile.account.role}</span>
            <span className={profile.account.isActive ? styles.activeBadge : styles.inactiveBadge}>
              {profile.account.isActive ? 'Active account' : 'Inactive account'}
            </span>
          </div>
        </div>
      </section>

      <div className={styles.sectionGrid}>
        <DetailCard title="Personal Information">
          <DetailGrid items={[
            { label: 'Full Name', value: profile.account.name },
            { label: 'Email', value: profile.account.email },
            { label: 'Age', value: profile.personal.age },
            { label: 'Date of Birth', value: formatDate(profile.personal.dateOfBirth) },
            { label: 'Gender', value: profile.personal.gender },
            { label: 'Nationality', value: profile.personal.nationality },
          ]} />
        </DetailCard>

        <DetailCard title="Custody Information">
          <DetailGrid items={[
            { label: 'Admission Date', value: formatDate(profile.custody.admissionDate) },
            { label: 'Cell Number', value: profile.custody.cellNumber },
            { label: 'Jail Type', value: profile.custody.jailType },
            { label: 'Jail Name', value: profile.custody.jailName },
            { label: 'Sentence Period', value: profile.custody.sentencePeriod },
          ]} />
        </DetailCard>
      </div>

      <DetailCard title="Case Information">
        <p className={styles.longText}>{displayValue(profile.caseInformation.caseDetails)}</p>
      </DetailCard>

      <div className={styles.sectionGrid}>
        <DetailCard title="Assigned Officer">
          {profile.assignedOfficer ? (
            <DetailGrid items={[
              { label: 'Officer Name', value: profile.assignedOfficer.name },
              {
                label: 'Officer Public ID',
                value: profile.assignedOfficer.publicId || 'Officer ID unavailable',
              },
            ]} />
          ) : (
            <EmptyStateAlert>No Officer is currently assigned.</EmptyStateAlert>
          )}
        </DetailCard>

        <DetailCard title="Activity Summary">
          <DetailGrid items={[
            { label: 'Total Parole Requests', value: profile.activitySummary.totalParoleRequests },
            { label: 'Pending Parole Requests', value: profile.activitySummary.pendingParoleRequests },
            { label: 'Approved Parole Requests', value: profile.activitySummary.approvedParoleRequests },
            { label: 'Rejected Parole Requests', value: profile.activitySummary.rejectedParoleRequests },
            { label: 'Total Appointments', value: profile.activitySummary.totalAppointments },
            { label: 'Upcoming Approved Visits', value: profile.activitySummary.upcomingApprovedVisits },
            { label: 'Completed Visits', value: profile.activitySummary.completedVisits },
          ]} />
        </DetailCard>
      </div>

      <div className={styles.sectionGrid}>
        <DetailCard title="FIR Records">
          {profile.firRecords.length ? (
            <div className={styles.recordList}>
              {profile.firRecords.map((record, index) => (
                <article key={`${record.firNumber}-${record.dateFiled}-${index}`}>
                  <h3>{record.firNumber}</h3>
                  <p>{displayValue(record.description)}</p>
                  <span>Filed {formatDate(record.dateFiled)}</span>
                </article>
              ))}
            </div>
          ) : (
            <EmptyStateAlert>No FIR records are currently available.</EmptyStateAlert>
          )}
        </DetailCard>

        <DetailCard title="Medical Records">
          {profile.medicalRecords.length ? (
            <div className={styles.recordList}>
              {profile.medicalRecords.map((record, index) => (
                <article key={`${record.updatedAt}-${index}`}>
                  <h3>Medical Record</h3>
                  <p><strong>Blood group:</strong> {displayValue(record.bloodGroup)}</p>
                  <p><strong>Allergies:</strong> {displayValue(record.allergies)}</p>
                  <p><strong>Checkup details:</strong> {displayValue(record.checkupDetails)}</p>
                  <span>Updated {formatDate(record.updatedAt)}</span>
                </article>
              ))}
            </div>
          ) : (
            <EmptyStateAlert>No medical records are currently available.</EmptyStateAlert>
          )}
        </DetailCard>
      </div>
    </div>
  );
}
