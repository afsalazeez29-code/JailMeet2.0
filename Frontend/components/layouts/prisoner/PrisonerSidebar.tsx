'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentType, type SVGProps } from 'react';
import { CalendarDays, FileText, History, LayoutDashboard, LockKeyhole, X } from 'lucide-react';

import iconStyles from '../../common/LucideIcon.module.css';
import s from './PrisonerTheme.module.css';

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

type PrisonerSidebarProps = {
  onCloseSidebar: () => void;
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

export default function PrisonerSidebar({
  onCloseSidebar,
}: PrisonerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
      aria-label="Prisoner navigation"
    >
      <div className="app-brand demo">
        <Link href="/prisoner/dashboard" className="app-brand-link" data-legacy-href="index.php">
          <img
            src="/images/logos/jmlogo.png"
            className="app-brand-logo"
            style={{ maxWidth: '180px', height: 'auto' }}
            alt="JailMeet"
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const content = (
            <>
              <Icon
                aria-hidden="true"
                className={`menu-icon tf-icons ${iconStyles.icon} ${iconStyles.sidebar}`}
              />
              <div>{item.label}</div>
            </>
          );

          return (
            <li
              key={item.href}
              className={`menu-item${isActive ? ' active' : ''}`}
            >
              {item.disabled ? (
                <span
                  className={`menu-link ${s.sidebarItem} ${s.sidebarItemDisabled}`}
                  aria-disabled="true"
                  data-legacy-href={item.legacyHref}
                  title={item.title}
                >
                  {content}
                </span>
              ) : (
                <Link
                  href={item.href}
                  data-legacy-href={item.legacyHref}
                  className={`menu-link ${s.sidebarItem} ${isActive ? s.sidebarItemActive : ''}`}
                  onClick={onCloseSidebar}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
