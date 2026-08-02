'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentType, type SVGProps } from 'react';
import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  ClipboardList,
  History,
  House,
  LifeBuoy,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';

import iconStyles from '../../common/LucideIcon.module.css';

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

const menuItems = [
  {
    href: '/visitor/dashboard',
    legacyHref: 'vhome.php',
    icon: House,
    label: 'Dashboard',
  },
  {
    href: '/visitor/prisoners',
    legacyHref: 'prisoners.php',
    icon: ClipboardList,
    label: 'View Prisoner',
  },
  {
    href: '/visitor/appointments/book',
    legacyHref: 'booking.php',
    icon: CalendarPlus,
    label: 'Book Appointment',
  },
  {
    href: '/visitor/appointments',
    legacyHref: 'status.php',
    icon: CalendarCheck,
    label: 'View Booking Status',
  },
  {
    href: '/visitor/visit-passes',
    legacyHref: 'visit-passes',
    icon: CalendarClock,
    label: 'Upcoming Visits',
  },
  {
    href: '/visitor/visit-history',
    legacyHref: 'visit-history',
    icon: History,
    label: 'Visit History',
  },
  {
    href: '/visitor/visit-rules',
    legacyHref: 'visit-rules',
    icon: ShieldCheck,
    label: 'Jail Rules',
  },
  {
    href: '/visitor/support',
    legacyHref: 'support',
    icon: LifeBuoy,
    label: 'Support',
  },
  {
    href: '/visitor/profile',
    legacyHref: 'profile.php',
    icon: UserRound,
    label: 'My Profile',
  },
  {
    href: '/visitor/change-password',
    legacyHref: 'changepassword.php',
    icon: LockKeyhole,
    label: 'Change Password',
  },
] satisfies ReadonlyArray<{
  href: string;
  legacyHref: string;
  icon: SidebarIcon;
  label: string;
}>;

type VisitorSidebarProps = {
  onCloseMenu?: () => void;
};

export default function VisitorSidebar({ onCloseMenu }: VisitorSidebarProps = {}) {
  const pathname = usePathname();

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <Link href="/" className="app-brand-link">
          <img
            src="/images/logos/jmlogobl.png"
            alt="Logo"
            className="app-brand-logo"
            style={{ maxWidth: '180px', height: 'auto' }}
          />
        </Link>
        <button
          className="layout-menu-toggle menu-link text-large ms-auto d-xl-none border-0 bg-transparent p-0"
          type="button"
          onClick={onCloseMenu}
          aria-label="Close navigation menu"
        >
          <X aria-hidden="true" className={iconStyles.icon} />
        </button>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/visitor/appointments' &&
              pathname.startsWith(`${item.href}/`)) ||
            (item.href === '/visitor/profile' && pathname === '/visitor/settings');

          return (
            <li
              key={item.href}
              className={`menu-item${isActive ? ' active' : ''}`}
            >
              <Link
                href={item.href}
                className="menu-link"
                data-legacy-href={item.legacyHref}
                onClick={onCloseMenu}
              >
                <Icon
                  aria-hidden="true"
                  className={`menu-icon tf-icons ${iconStyles.icon} ${iconStyles.sidebar}`}
                />
                <div>{item.label}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
