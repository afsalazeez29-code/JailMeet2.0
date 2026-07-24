'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentType, type SVGProps } from 'react';
import { CalendarDays, FileText, History, LayoutDashboard, LockKeyhole } from 'lucide-react';

import iconStyles from '../../common/LucideIcon.module.css';

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

type PrisonerSidebarProps = {
  sidebarOpen: boolean;
};

const menuItems = [
  {
    href: '/prisoner/dashboard',
    legacyHref: 'index.php',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/prisoner/parole/request',
    legacyHref: 'parole.php',
    icon: FileText,
    label: 'Submit Parole Request',
  },
  {
    href: '/prisoner/visits/history',
    legacyHref: 'visitorhistory.php',
    icon: History,
    label: 'Visitors History',
    disabled: true,
    title: 'Visitor history is not implemented yet',
  },
  {
    href: '/prisoner/parole',
    legacyHref: 'parolestatus.php',
    icon: CalendarDays,
    label: 'Parole Status',
  },
  {
    href: '/prisoner/change-password',
    legacyHref: 'changepassword.php',
    icon: LockKeyhole,
    label: 'Change Password',
  },
] satisfies ReadonlyArray<{
  href: string;
  legacyHref: string;
  icon: SidebarIcon;
  label: string;
  disabled?: boolean;
  title?: string;
}>;

export default function PrisonerSidebar({ sidebarOpen }: PrisonerSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      id="sidebar-wrapper"
      data-simplebar=""
      data-simplebar-auto-hide="true"
      className={sidebarOpen ? 'toggled' : undefined}
    >
      <div className="brand-logo">
        <Link href="/prisoner/dashboard" data-legacy-href="index.php">
          <img
            src="/images/logos/jmlogo.png"
            className="logo-icon"
            alt="JailMeet"
          />
          <h5 className="logo-text">JailMeet</h5>
        </Link>
      </div>
      <ul className="sidebar-menu do-nicescrol">
        <li className="sidebar-header"></li>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const renderedIcon = (
            <Icon
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.sidebar}`}
            />
          );

          return (
            <li className={pathname === item.href ? 'active' : undefined} key={item.href}>
              {item.disabled ? (
                <span
                  data-legacy-href={item.legacyHref}
                  aria-disabled="true"
                  title={item.title}
                >
                  {renderedIcon} <span>{item.label}</span>
                </span>
              ) : (
                <Link href={item.href} data-legacy-href={item.legacyHref}>
                  {renderedIcon} <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
