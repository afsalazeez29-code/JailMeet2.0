'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentType, type SVGProps } from 'react';
import { CalendarDays, FileText, History, LayoutDashboard, LockKeyhole } from 'lucide-react';

import iconStyles from '../../common/LucideIcon.module.css';
import s from './PrisonerTheme.module.css';

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
    <aside
      id="sidebar-wrapper"
      data-simplebar=""
      data-simplebar-auto-hide="true"
      className={`${s.sidebar}${sidebarOpen ? ' toggled' : ''}`}
      aria-label="Prisoner navigation"
    >
      <div className={s.sidebarBrand}>
        <Link href="/prisoner/dashboard" data-legacy-href="index.php">
          <img
            src="/images/logos/jmlogo.png"
            className={s.sidebarLogo}
            alt="JailMeet"
          />
        </Link>
      </div>

      <ul className={s.sidebarNav} role="list">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const renderedIcon = (
            <Icon
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.sidebar} ${s.navIcon}`}
            />
          );
          
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              {item.disabled ? (
                <span
                  data-legacy-href={item.legacyHref}
                  aria-disabled="true"
                  title={item.title}
                  className={`${s.navPill} ${s.navPillDisabled}`}
                >
                  {renderedIcon}
                  <span className={s.navLabel}>{item.label}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  data-legacy-href={item.legacyHref}
                  className={`${s.navPill}${isActive ? ` ${s.navPillActive}` : ''}`}
                >
                  {renderedIcon}
                  <span className={s.navLabel}>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
