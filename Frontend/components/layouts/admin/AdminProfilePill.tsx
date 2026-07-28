'use client';

import Link from 'next/link';

import s from './AdminTheme.module.css';

type AdminProfilePillProps = {
  /** Display name for the authenticated admin */
  displayName: string;
  /** Avatar source URL */
  avatarSrc?: string;
};

export default function AdminProfilePill({
  displayName,
  avatarSrc,
}: AdminProfilePillProps) {
  const safeName = displayName.trim() || 'Admin';

  return (
    <Link
      href="/admin/profile"
      className={s.profilePill}
      aria-label={`Open ${safeName} profile`}
    >
      <span className={s.avatarWrap}>
        {avatarSrc ? (
          <img src={avatarSrc} alt={`${safeName} profile`} className={s.avatar} />
        ) : (
          <span className={s.avatar}>A</span>
        )}
        <span className={s.onlineDot} aria-hidden="true" />
      </span>
      <span className={s.profileName}>{safeName}</span>
    </Link>
  );
}
