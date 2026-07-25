'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, type ComponentType, type SVGProps } from 'react';
import {
  CalendarDays,
  Ellipsis,
  FileText,
  House,
  LockKeyhole,
  Menu,
  MoreVertical,
  PanelLeftClose,
  UserCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';

import iconStyles from '../../common/LucideIcon.module.css';

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

const navItems = [
  {
    href: '/admin/dashboard',
    legacyHref: 'adindex.php',
    icon: House,
    label: 'Dashboard',
  },
  {
    href: '/admin/users',
    legacyHref: 'users.php',
    icon: UsersRound,
    label: 'Users',
  },
  {
    href: '/admin/visitors',
    legacyHref: 'userdetails.php',
    icon: UserCheck,
    label: 'Visitors',
  },
  {
    href: '/admin/officers',
    legacyHref: 'officersdetails.php',
    icon: UserRound,
    label: 'Officers',
  },
  {
    href: '/admin/prisoners',
    legacyHref: 'prisonerdetails.php',
    icon: UserRound,
    label: 'Prisoners',
  },
  {
    href: '/admin/appointments',
    legacyHref: 'appointments.php',
    icon: CalendarDays,
    label: 'Appointments',
  },
  {
    href: '/admin/parole',
    legacyHref: 'parolerequests.php',
    icon: FileText,
    label: 'Parole Requests',
  },
  {
    href: '/admin/change-password',
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

type AdminSidebarProps = {
  onToggleSidebar: () => void;
};

export default function AdminSidebar({ onToggleSidebar }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        <div className="logo-header" data-background-color="dark">
          <Link href="/" className="logo d-flex align-items-center">
            <img
              src="/images/logos/jmlogo.png"
              alt="JailMeet home"
              className="navbar-brand"
              style={{ height: '32px' }}
            />
          </Link>
          <div className="nav-toggle">
            <button
              className="btn btn-toggle toggle-sidebar"
              type="button"
              onClick={onToggleSidebar}
            >
              <Menu
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.navbar}`}
              />
            </button>
            <button
              className="btn btn-toggle sidenav-toggler"
              type="button"
              onClick={onToggleSidebar}
            >
              <PanelLeftClose
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.navbar}`}
              />
            </button>
          </div>
          <button
            className="topbar-toggler more"
            type="button"
            onClick={onToggleSidebar}
          >
            <MoreVertical
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.navbar}`}
            />
          </button>
        </div>
      </div>

      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">
            {navItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Fragment key={item.href}>
                  {index === 1 ? (
                    <li className="nav-section">
                      <span className="sidebar-mini-icon">
                        <Ellipsis
                          aria-hidden="true"
                          className={`${iconStyles.icon} ${iconStyles.sidebar}`}
                        />
                      </span>
                      <h4 className="text-section">Components</h4>
                    </li>
                  ) : null}
                  <li
                    className={`nav-item${
                      pathname === item.href ? ' active' : ''
                    }`}
                  >
                    <Link href={item.href} data-legacy-href={item.legacyHref}>
                      <Icon
                        aria-hidden="true"
                        className={`${iconStyles.icon} ${iconStyles.sidebar}`}
                      />
                      <p>{item.label}</p>
                    </Link>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
