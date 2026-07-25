'use client';

import styles from './AdminProfilePill.module.css';

type AdminProfilePillProps = {
  /** Display name for the authenticated admin */
  displayName: string;
  /** Avatar source URL */
  avatarSrc?: string;
  /** Toggle handler for the dropdown */
  onClick: () => void;
  /** Accessibility state for the dropdown */
  ariaExpanded: boolean;
};

/**
 * AdminProfilePill — acts as an accessible dropdown trigger button.
 */
export default function AdminProfilePill({
  displayName,
  avatarSrc,
  onClick,
  ariaExpanded,
}: AdminProfilePillProps) {
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

  return (
    <button
      type="button"
      className={styles.pill}
      aria-label={`Profile menu for ${displayName}`}
      aria-expanded={ariaExpanded}
      onClick={onClick}
    >
      <span className={styles.avatarWrap} aria-hidden="true">
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className={styles.avatar} />
        ) : (
          <span
            className={styles.avatar}
            style={{
              background: '#111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'inherit',
            }}
          >
            {initials || 'A'}
          </span>
        )}
        <span className={styles.onlineDot} aria-hidden="true" />
      </span>
      <span className={styles.name}>{displayName}</span>
    </button>
  );
}
