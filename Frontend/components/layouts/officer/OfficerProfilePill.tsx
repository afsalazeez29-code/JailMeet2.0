'use client';

import Link from 'next/link';

import s from './OfficerTheme.module.css';

type OfficerProfilePillProps = {
  /** Display name for the authenticated officer */
  displayName: string;
  /** Avatar source URL */
  avatarSrc?: string;
};

export default function OfficerProfilePill({
  displayName,
  avatarSrc,
}: OfficerProfilePillProps) {
  const safeName = displayName.trim() || 'Officer';

  return (
    <Link
      href="/officer/profile"
      className={s.profilePill}
      aria-label={`Open ${safeName} profile`}
    >
      <span className={s.avatarWrap}>
        {avatarSrc ? (
          <img src={avatarSrc} alt={`${safeName} profile`} className={s.avatar} />
        ) : (
          <span className={s.avatar}>O</span>
        )}
        <span className={s.onlineDot} aria-hidden="true" />
      </span>
      <span className={s.profileName}>{safeName}</span>
    </Link>
  );
}
