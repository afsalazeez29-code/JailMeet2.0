'use client';

import s from './AdminTheme.module.css';

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

export default function AdminProfilePill({
  displayName,
  avatarSrc,
  onClick,
  ariaExpanded,
}: AdminProfilePillProps) {
  const safeName = displayName.trim() || 'Admin';

  return (
    <button
      type="button"
      className={s.profilePill}
      aria-label={`Profile menu for ${safeName}`}
      aria-expanded={ariaExpanded}
      onClick={onClick}
    >
      <span className={s.avatarWrap} aria-hidden="true">
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className={s.avatar} />
        ) : (
          <span className={s.avatar}>A</span>
        )}
        <span className={s.onlineDot} aria-hidden="true" />
      </span>
      <span className={s.profileName}>{safeName}</span>
    </button>
  );
}
