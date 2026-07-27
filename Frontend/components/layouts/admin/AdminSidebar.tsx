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
  UserCheck,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

import iconStyles from '../../common/LucideIcon.module.css';
import s from './AdminTheme.module.css';

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
  onCloseSidebar: () => void;
};

export default function AdminSidebar({ onCloseSidebar }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
      aria-label="Admin navigation"
    >
      <div className="app-brand demo">
        <Link href="/" className="app-brand-link" aria-label="JailMeet home">
          <img
            src="/images/logos/jmlogo.png"
            alt="JailMeet home"
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

      <nav>
          <ul className="menu-inner py-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Fragment key={item.href}>
                  {index === 1 ? (
                    <li className={`menu-item ${s.navSection}`}>
                      <span>
                        <Ellipsis
                          aria-hidden="true"
                          className={`menu-icon tf-icons ${iconStyles.icon} ${iconStyles.sidebar}`}
                        />
                      </span>
                      <h4 className={s.navSectionText}>Components</h4>
                    </li>
                  ) : null}
                  <li className={`menu-item${pathname === item.href ? ' active' : ''}`}>
                    <Link
                      href={item.href}
                      data-legacy-href={item.legacyHref}
                      className="menu-link"
                      onClick={onCloseSidebar}
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
      </nav>
    </aside>
  );
}
