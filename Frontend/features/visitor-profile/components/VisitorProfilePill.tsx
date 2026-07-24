import Link from 'next/link';

import styles from './VisitorProfilePill.module.css';

type VisitorProfilePillProps = {
  fullName: string;
  profileImage?: string | null;
};

export default function VisitorProfilePill({
  fullName,
  profileImage,
}: VisitorProfilePillProps) {
  const displayName = fullName.trim() || 'Visitor';
  const avatarSrc = profileImage || '/images/avatars/visitor-default.png';

  return (
    <Link
      href="/visitor/settings"
      className={styles.profilePill}
      aria-label={`Open ${displayName} profile settings`}
    >
      <span className={styles.avatarWrap}>
        <img
          src={avatarSrc}
          alt={`${displayName} profile`}
          className={styles.avatar}
        />
        <span className={styles.onlineDot} aria-hidden="true" />
      </span>
      <span className={styles.profileName}>{displayName}</span>
    </Link>
  );
}
