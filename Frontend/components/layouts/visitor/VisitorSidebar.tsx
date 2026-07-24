'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, type ComponentType, type SVGProps } from 'react';
import {
  CalendarCheck,
  CalendarPlus,
  ClipboardList,
  House,
  LockKeyhole,
  UserRoundPen,
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
    href: '/visitor/settings',
    legacyHref: 'accountsettings.php',
    icon: UserRoundPen,
    label: 'Edit Profile',
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

export default function VisitorSidebar() {
  const pathname = usePathname();

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <Link href="/visitor/dashboard" className="app-brand-link">
          <img
            src="/images/visitor/jmblack.png"
            alt="Logo"
            className="app-brand-logo"
            style={{ maxWidth: '180px', height: 'auto' }}
          />
        </Link>
      </div>

      <div className="menu-inner-shadow"></div>

      <div className="user-info text-center p-3" style={{ display: 'none' }}>
        <img
          src="/images/visitor/sidebar-avatar.png"
          alt="User Avatar"
          className="w-px-50 h-auto rounded-circle mb-2"
        />
        <h1>Welcome, Visitor!</h1>
        <small className="text-muted">ID: Visitor</small>
        <br />
        <small className="text-muted">visitor@jailmeet.com</small>
      </div>

      <ul className="menu-inner py-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Fragment key={item.href}>
              {index === 1 ? (
                <li className="menu-header small text-uppercase">
                  <span className="menu-header-text">Pages</span>
                </li>
              ) : null}
              <li
                className={`menu-item${pathname === item.href ? ' active' : ''}`}
              >
                <Link
                  href={item.href}
                  className="menu-link"
                  data-legacy-href={item.legacyHref}
                >
                  <Icon
                    aria-hidden="true"
                    className={`menu-icon tf-icons ${iconStyles.icon} ${iconStyles.sidebar}`}
                  />
                  <div>{item.label}</div>
                </Link>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </aside>
  );
}
