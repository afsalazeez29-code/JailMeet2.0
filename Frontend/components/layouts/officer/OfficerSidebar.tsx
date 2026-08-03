'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentType, type SVGProps, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  FileText,
  HeartPulse,
  House,
  ListChecks,
  LockKeyhole,
  QrCode,
  Search,
  ShieldCheck,
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
    href: '/officer/appointments?status=PENDING',
    legacyHref: 'newappointment.php',
    label: 'New Appointment',
  },
  {
    href: '/officer/appointments?status=ACCEPTED',
    legacyHref: 'accepted.php',
    label: 'Accepted',
  },
  {
    href: '/officer/appointments?status=REJECTED',
    legacyHref: 'rejected.php',
    label: 'Rejected',
  },
  {
    href: '/officer/appointments?status=ALL',
    legacyHref: 'all.php',
    label: 'All',
  },
];

const paroleItems = [
  {
    href: '/officer/parole?status=ALL',
    legacyHref: 'requests.php',
    label: 'Parole Requests',
  },
  {
    href: '/officer/parole?status=PENDING',
    legacyHref: 'pendingparole.php',
    label: 'Pending',
  },
  {
    href: '/officer/parole?status=ACCEPTED',
    legacyHref: 'acceptedparole.php',
    label: 'Accepted',
  },
  {
    href: '/officer/parole?status=REJECTED',
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
        <span className="app-brand-link">
          <img
            src="/images/logos/jmlogo.png"
            alt="JailMeet"
            className="app-brand-logo"
            style={{ maxWidth: '180px', height: 'auto' }}
          />
        </span>
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
            className={`menu-link ${s.sidebarItem} ${isActive('/officer/dashboard') ? s.sidebarItemActive : ''}`}
            onClick={onCloseSidebar}
          >
            {renderIcon(House)}
            <div>Home</div>
          </Link>
        </li>

        <li className={`menu-item${isSectionActive('/officer/appointments') ? ' active' : ''}`}>
          <button
            className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/appointments') ? s.sidebarItemActive : ''}`}
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
                  className={`menu-link ${s.sidebarItem} ${isActive(item.href) ? s.sidebarItemActive : ''}`}
                  onClick={onCloseSidebar}
                >
                  <div>{item.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </li>

        <li className={`menu-item${isSectionActive('/officer/prisoners') ? ' active' : ''}`}>
          <Link href="/officer/prisoners" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/prisoners') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>
            {renderIcon(UsersRound)}
            <div>Assigned Prisoners</div>
          </Link>
        </li>

        <li className={`menu-item${isSectionActive('/officer/visit-verification') ? ' active' : ''}`}>
          <Link href="/officer/visit-verification" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/visit-verification') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>
            {renderIcon(QrCode)}<div>Visit Verification</div>
          </Link>
        </li>
        <li className={`menu-item${isSectionActive('/officer/change-requests') ? ' active' : ''}`}>
          <Link href="/officer/change-requests" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/change-requests') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>
            {renderIcon(ListChecks)}<div>Change Requests</div>
          </Link>
        </li>
        <li className={`menu-item${isSectionActive('/officer/fir-records') ? ' active' : ''}`}>
          <Link href="/officer/fir-records" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/fir-records') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>
            {renderIcon(FileText)}
            <div>FIR Records</div>
          </Link>
        </li>
        <li className={`menu-item${isSectionActive('/officer/health-records') ? ' active' : ''}`}>
          <Link href="/officer/health-records" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/health-records') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>
            {renderIcon(HeartPulse)}<div>Health Records</div>
          </Link>
        </li>

        <li className={`menu-item${isSectionActive('/officer/parole') ? ' active' : ''}`}>
          <button
            className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/parole') ? s.sidebarItemActive : ''}`}
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
                  className={`menu-link ${s.sidebarItem} ${isActive(item.href) ? s.sidebarItemActive : ''}`}
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

        <li className={`menu-item${isSectionActive('/officer/support-escalations') ? ' active' : ''}`}>
          <Link href="/officer/support-escalations" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/support-escalations') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>{renderIcon(ShieldCheck)}<div>Support Actions</div></Link>
        </li>
        <li className={`menu-item${isSectionActive('/officer/activity') ? ' active' : ''}`}>
          <Link href="/officer/activity" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/activity') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>{renderIcon(ListChecks)}<div>My Activity</div></Link>
        </li>
        <li className={`menu-item${isSectionActive('/officer/reports') ? ' active' : ''}`}>
          <Link href="/officer/reports" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/reports') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>{renderIcon(FileText)}<div>Reports</div></Link>
        </li>
        <li className={`menu-item${isSectionActive('/officer/search') ? ' active' : ''}`}>
          <Link href="/officer/search" className={`menu-link ${s.sidebarItem} ${isSectionActive('/officer/search') ? s.sidebarItemActive : ''}`} onClick={onCloseSidebar}>{renderIcon(Search)}<div>Search</div></Link>
        </li>

        <li className={`menu-item${isActive('/officer/change-password') ? ' active' : ''}`}>
          <Link
            href="/officer/change-password"
            data-legacy-href="changepassword.php"
            className={`menu-link ${s.sidebarItem} ${isActive('/officer/change-password') ? s.sidebarItemActive : ''}`}
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
