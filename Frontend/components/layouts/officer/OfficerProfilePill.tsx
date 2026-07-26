'use client';

import Link from 'next/link';
import styles from './OfficerProfilePill.module.css';

type OfficerProfilePillProps = {
  /** Display name for the authenticated officer */
  displayName: string;
};

/**
 * OfficerProfilePill — clickable pill container.
 * Navigates to /officer/profile
 */
export default function OfficerProfilePill({
  displayName,
}: OfficerProfilePillProps) {
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

  return (
    <Link href="/officer/profile" className={styles.pill} aria-label={`Logged in as ${displayName}`}>
      <span className={styles.avatarWrap} aria-hidden="true">
        {/* Initials-based avatar — replaced with a real avatar once the profile route exists */}
        <span
          className={styles.avatar}
          style={{
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'inherit',
          }}
        >
          {initials || 'O'}
        </span>
        <span className={styles.onlineDot} aria-hidden="true" />
      </span>
      <span className={styles.name}>{displayName}</span>
    </Link>
  );
}
