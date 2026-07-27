'use client';

import s from './PrisonerTheme.module.css';

type PrisonerProfilePillProps = {
  /** Display name for the authenticated prisoner */
  displayName: string;
  /** Avatar source URL */
  avatarSrc?: string;
  /** Toggle handler for the dropdown */
  onClick: () => void;
  /** Accessibility state for the dropdown */
  ariaExpanded: boolean;
};

export default function PrisonerProfilePill({
  displayName,
  avatarSrc,
  onClick,
  ariaExpanded,
}: PrisonerProfilePillProps) {
  const safeName = displayName.trim() || 'Prisoner';

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
          <span className={s.avatar}>P</span>
        )}
        <span className={s.onlineDot} aria-hidden="true" />
      </span>
      <span className={s.profileName}>{safeName}</span>
    </button>
  );
}
