'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FileText,
  House,
  LockKeyhole,
  UsersRound,
  X,
} from 'lucide-react';

import iconStyles from '../../common/LucideIcon.module.css';
import s from './OfficerTheme.module.css';

type SidebarIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type OfficerSidebarProps = {
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
};

const bookingItems = [
  {
    href: '/officer/appointments',
    legacyHref: 'newappointment.php',
    label: 'New Appointment',
  },
  {
    href: '/officer/appointments',
    legacyHref: 'accepted.php',
    label: 'Accepted',
  },
  {
    href: '/officer/appointments',
    legacyHref: 'rejected.php',
    label: 'Rejected',
  },
  {
    href: '/officer/appointments',
    legacyHref: 'all.php',
    label: 'All',
  },
];

const paroleItems = [
  {
    href: '/officer/parole',
    legacyHref: 'requests.php',
    label: 'Parole Requests',
  },
  {
    href: '/officer/parole',
    legacyHref: 'pendingparole.php',
    label: 'Pending',
  },
  {
    href: '/officer/parole',
    legacyHref: 'acceptedparole.php',
    label: 'Accepted',
  },
  {
    href: '/officer/parole',
    legacyHref: 'rejectedparole.php',
    label: 'Rejected',
  },
];

export default function OfficerSidebar({
  sidebarOpen,
  onCloseSidebar,
}: OfficerSidebarProps) {
  const pathname = usePathname();



  const [bookingsOpen, setBookingsOpen] = useState(
    pathname.startsWith('/officer/appointments'),
  );
  const [paroleOpen, setParoleOpen] = useState(
    pathname.startsWith('/officer/parole'),
  );

  const isActive = (href: string) => pathname === href;
  const isSectionActive = (prefix: string) => pathname.startsWith(prefix);

  return (
    <>


      {/* Mobile overlay */}
      <button
        className={`${s.overlay}${sidebarOpen ? ` ${s.overlayVisible}` : ''}`}
        type="button"
        aria-label="Close officer menu overlay"
        onClick={onCloseSidebar}
      />

      {/* Sidebar panel */}
      <aside
        className={`${s.sidebar}${sidebarOpen ? ` ${s.sidebarOpen}` : ''}`}
        aria-label="Officer navigation"
      >
        {/* Brand / Logo */}
        <div className={s.sidebarBrand}>
          <Link href="/" aria-label="JailMeet home">
            <img
              src="/images/logos/jmlogo.png"
              alt="JailMeet"
              className={s.sidebarLogo}
            />
          </Link>
          <button
            className={s.sidebarCloseBtn}
            type="button"
            aria-label="Close sidebar"
            onClick={onCloseSidebar}
          >
            <X
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.navbar}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <ul className={s.sidebarNav} role="list">
          {/* Home */}
          <li>
            <Link
              href="/officer/dashboard"
              data-legacy-href="index.php"
              className={`${s.navPill}${isActive('/officer/dashboard') ? ` ${s.navPillActive}` : ''}`}
            >
              <House
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.sidebar} ${s.navIcon}`}
              />
              <span className={s.navLabel}>Home</span>
            </Link>
          </li>

          {/* Bookings group */}
          <li>
            <button
              className={`${s.groupToggle}${
                bookingsOpen || isSectionActive('/officer/appointments')
                  ? ` ${s.groupToggleActive}`
                  : ''
              }`}
              type="button"
              aria-expanded={bookingsOpen || isSectionActive('/officer/appointments')}
              onClick={() => setBookingsOpen((prev) => !prev)}
            >
              <CalendarDays
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.sidebar} ${s.navIcon}`}
              />
              <span className={s.navLabel}>Bookings</span>
              <ChevronDown
                aria-hidden="true"
                className={`${s.groupChevron}${
                  bookingsOpen || isSectionActive('/officer/appointments')
                    ? ` ${s.groupChevronOpen}`
                    : ''
                }`}
              />
            </button>

            <ul
              className={`${s.submenu}${
                bookingsOpen || isSectionActive('/officer/appointments')
                  ? ''
                  : ` ${s.submenuHidden}`
              }`}
              role="list"
            >
              {bookingItems.map((item) => (
                <li key={item.legacyHref}>
                  <Link
                    href={item.href}
                    data-legacy-href={item.legacyHref}
                    className={`${s.subPill}${isActive(item.href) ? ` ${s.subPillActive}` : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Prisoners — not yet implemented, non-clickable */}
          <li>
            <span
              className={`${s.navPill} ${s.navPillDisabled}`}
              aria-disabled="true"
              data-legacy-href="prisoners.php"
              title="Prisoner management is not implemented for officers yet"
            >
              <UsersRound
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.sidebar} ${s.navIcon}`}
              />
              <span className={s.navLabel}>Prisoners</span>
            </span>
          </li>

          {/* FIR — not yet implemented, non-clickable */}
          <li>
            <span
              className={`${s.navPill} ${s.navPillDisabled}`}
              aria-disabled="true"
              data-legacy-href="fir.php"
              title="FIR management is not implemented yet"
            >
              <FileText
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.sidebar} ${s.navIcon}`}
              />
              <span className={s.navLabel}>FIR</span>
            </span>
          </li>

          {/* Parole group */}
          <li>
            <button
              className={`${s.groupToggle}${
                paroleOpen || isSectionActive('/officer/parole')
                  ? ` ${s.groupToggleActive}`
                  : ''
              }`}
              type="button"
              aria-expanded={paroleOpen || isSectionActive('/officer/parole')}
              onClick={() => setParoleOpen((prev) => !prev)}
            >
              <FileText
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.sidebar} ${s.navIcon}`}
              />
              <span className={s.navLabel}>Parole</span>
              <ChevronDown
                aria-hidden="true"
                className={`${s.groupChevron}${
                  paroleOpen || isSectionActive('/officer/parole')
                    ? ` ${s.groupChevronOpen}`
                    : ''
                }`}
              />
            </button>

            <ul
              className={`${s.submenu}${
                paroleOpen || isSectionActive('/officer/parole')
                  ? ''
                  : ` ${s.submenuHidden}`
              }`}
              role="list"
            >
              {paroleItems.map((item) => (
                <li key={item.legacyHref}>
                  <Link
                    href={item.href}
                    data-legacy-href={item.legacyHref}
                    className={`${s.subPill}${isActive(item.href) ? ` ${s.subPillActive}` : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <hr className={s.navDivider} />
          </li>

          {/* Change Password */}
          <li>
            <Link
              href="/officer/change-password"
              data-legacy-href="changepassword.php"
              className={`${s.navPill}${isActive('/officer/change-password') ? ` ${s.navPillActive}` : ''}`}
            >
              <LockKeyhole
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.sidebar} ${s.navIcon}`}
              />
              <span className={s.navLabel}>Change Password</span>
            </Link>
          </li>
        </ul>
      </aside>

    </>
  );
}
