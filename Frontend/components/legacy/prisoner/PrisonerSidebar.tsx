'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type PrisonerSidebarProps = {
  sidebarOpen: boolean;
};

const menuItems = [
  {
    href: '/prisoner/dashboard',
    legacyHref: 'index.php',
    icon: 'zmdi zmdi-view-dashboard',
    label: 'Dashboard',
  },
  {
    href: '/prisoner/parole/request',
    legacyHref: 'parole.php',
    icon: 'zmdi zmdi-invert-colors',
    label: 'Submit Parole Request',
  },
  {
    href: '/prisoner/visits/history',
    legacyHref: 'visitorhistory.php',
    icon: 'zmdi zmdi-face',
    label: 'Visitors History',
  },
  {
    href: '/prisoner/parole',
    legacyHref: 'parolestatus.php',
    icon: 'zmdi zmdi-invert-colors',
    label: 'Parole Status',
  },
  {
    href: '/prisoner/change-password',
    legacyHref: 'changepassword.php',
    icon: 'zmdi zmdi-lock',
    label: 'Change Password',
  },
];

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
            src="/legacy/logos/jmlogo.png"
            className="logo-icon"
            alt="JailMeet"
          />
          <h5 className="logo-text">JailMeet</h5>
        </Link>
      </div>
      <ul className="sidebar-menu do-nicescrol">
        <li className="sidebar-header"></li>
        {menuItems.map((item) => (
          <li className={pathname === item.href ? 'active' : undefined} key={item.href}>
            <Link href={item.href} data-legacy-href={item.legacyHref}>
              <i className={item.icon}></i> <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
