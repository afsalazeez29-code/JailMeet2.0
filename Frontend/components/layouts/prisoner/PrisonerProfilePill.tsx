'use client';

import Link from 'next/link';

import s from './PrisonerTheme.module.css';

type PrisonerProfilePillProps = {
  /** Display name for the authenticated prisoner */
  displayName: string;
  /** Avatar source URL */
  avatarSrc?: string;
};

export default function PrisonerProfilePill({
  displayName,
  avatarSrc,
}: PrisonerProfilePillProps) {
  const safeName = displayName.trim() || 'Prisoner';

  return (
    <Link
      href="/prisoner/profile"
      className={s.profilePill}
      aria-label={`Open ${safeName} profile`}
    >
      <span className={s.avatarWrap}>
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={`${safeName} profile`}
            className={s.avatar}
            onError={(event) => {
              event.currentTarget.src = '/images/avatars/prisoner-default.png';
            }}
          />
        ) : (
          <span className={s.avatar}>P</span>
        )}
        <span className={s.onlineDot} aria-hidden="true" />
      </span>
      <span className={s.profileName}>{safeName}</span>
    </Link>
  );
}
