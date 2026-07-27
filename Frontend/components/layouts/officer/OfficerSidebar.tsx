'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentType, type SVGProps, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  FileText,
  House,
  LockKeyhole,
  UsersRound,
  X,
} from 'lucide-react';

import iconStyles from '../../common/LucideIcon.module.css';
import s from './OfficerTheme.module.css';

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

type OfficerSidebarProps = {
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

export default function OfficerSidebar({ onCloseSidebar }: OfficerSidebarProps) {
  const pathname = usePathname();

  const [bookingsOpen, setBookingsOpen] = useState(
    pathname.startsWith('/officer/appointments'),
  );
  const [paroleOpen, setParoleOpen] = useState(
    pathname.startsWith('/officer/parole'),
  );

  const isActive = (href: string) => pathname === href;
  const isSectionActive = (prefix: string) => pathname.startsWith(prefix);

  const renderIcon = (Icon: SidebarIcon) => (
    <Icon
      aria-hidden="true"
      className={`menu-icon tf-icons ${iconStyles.icon} ${iconStyles.sidebar}`}
    />
  );

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
      aria-label="Officer navigation"
    >
      <div className="app-brand demo">
        <Link href="/" className="app-brand-link" aria-label="JailMeet home">
          <img
            src="/images/logos/jmlogo.png"
            alt="JailMeet"
            className="app-brand-logo"
            style={{ maxWidth: '180px', height: 'auto' }}
          />
        </Link>
        <button
          className="layout-menu-toggle menu-link text-large ms-auto d-xl-none border-0 bg-transparent p-0"
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

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        <li className={`menu-item${isActive('/officer/dashboard') ? ' active' : ''}`}>
          <Link
            href="/officer/dashboard"
            data-legacy-href="index.php"
            className="menu-link"
            onClick={onCloseSidebar}
          >
            {renderIcon(House)}
            <div>Home</div>
          </Link>
        </li>

        <li className={`menu-item${isSectionActive('/officer/appointments') ? ' active' : ''}`}>
          <button
            className="menu-link"
            type="button"
            aria-expanded={bookingsOpen || isSectionActive('/officer/appointments')}
            onClick={() => setBookingsOpen((prev) => !prev)}
          >
            {renderIcon(CalendarDays)}
            <div>Bookings</div>
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
            className={`officer-submenu ${s.submenu}${
              bookingsOpen || isSectionActive('/officer/appointments')
                ? ''
                : ` ${s.submenuHidden}`
            }`}
          >
            {bookingItems.map((item) => (
              <li
                key={item.legacyHref}
                className={`menu-item${isActive(item.href) ? ' active' : ''}`}
              >
                <Link
                  href={item.href}
                  data-legacy-href={item.legacyHref}
                  className="menu-link"
                  onClick={onCloseSidebar}
                >
                  <div>{item.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </li>

        <li className="menu-item">
          <span
            className={`menu-link ${s.navPillDisabled}`}
            aria-disabled="true"
            data-legacy-href="prisoners.php"
            title="Prisoner management is not implemented for officers yet"
          >
            {renderIcon(UsersRound)}
            <div>Prisoners</div>
          </span>
        </li>

        <li className="menu-item">
          <span
            className={`menu-link ${s.navPillDisabled}`}
            aria-disabled="true"
            data-legacy-href="fir.php"
            title="FIR management is not implemented yet"
          >
            {renderIcon(FileText)}
            <div>FIR</div>
          </span>
        </li>

        <li className={`menu-item${isSectionActive('/officer/parole') ? ' active' : ''}`}>
          <button
            className="menu-link"
            type="button"
            aria-expanded={paroleOpen || isSectionActive('/officer/parole')}
            onClick={() => setParoleOpen((prev) => !prev)}
          >
            {renderIcon(FileText)}
            <div>Parole</div>
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
            className={`officer-submenu ${s.submenu}${
              paroleOpen || isSectionActive('/officer/parole')
                ? ''
                : ` ${s.submenuHidden}`
            }`}
          >
            {paroleItems.map((item) => (
              <li
                key={item.legacyHref}
                className={`menu-item${isActive(item.href) ? ' active' : ''}`}
              >
                <Link
                  href={item.href}
                  data-legacy-href={item.legacyHref}
                  className="menu-link"
                  onClick={onCloseSidebar}
                >
                  <div>{item.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </li>

        <li className="menu-item">
          <hr className={s.navDivider} />
        </li>

        <li className={`menu-item${isActive('/officer/change-password') ? ' active' : ''}`}>
          <Link
            href="/officer/change-password"
            data-legacy-href="changepassword.php"
            className="menu-link"
            onClick={onCloseSidebar}
          >
            {renderIcon(LockKeyhole)}
            <div>Change Password</div>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
