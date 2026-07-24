'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

const navItems = [
  {
    href: '/admin/dashboard',
    legacyHref: 'adindex.php',
    icon: 'fas fa-home',
    label: 'Dashboard',
  },
  {
    href: '/admin/users',
    legacyHref: 'users.php',
    icon: 'fas fa-users',
    label: 'Users',
  },
  {
    href: '/admin/visitors',
    legacyHref: 'userdetails.php',
    icon: 'fas fa-user-circle',
    label: 'Visitors',
  },
  {
    href: '/admin/officers',
    legacyHref: 'officersdetails.php',
    icon: 'fas fa-user-circle',
    label: 'Officers',
  },
  {
    href: '/admin/prisoners',
    legacyHref: 'prisonerdetails.php',
    icon: 'fas fa-user-circle',
    label: 'Prisoners',
  },
  {
    href: '/admin/appointments',
    legacyHref: 'appointments.php',
    icon: 'fas fa-th',
    label: 'Appointments',
  },
  {
    href: '/admin/parole',
    legacyHref: 'parolerequests.php',
    icon: 'fas fa-file-alt',
    label: 'Parole Requests',
  },
  {
    href: '/admin/change-password',
    legacyHref: 'changepassword.php',
    icon: 'fas fa-lock',
    label: 'Change Password',
  },
];

type AdminSidebarProps = {
  onToggleSidebar: () => void;
};

export default function AdminSidebar({ onToggleSidebar }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        <div className="logo-header" data-background-color="dark">
          <Link href="/admin/dashboard" className="logo">
            <img
              src="/images/logos/jmlogo.png"
              alt="navbar brand"
              className="navbar-brand"
              height="20"
            />
          </Link>
          <div className="nav-toggle">
            <button
              className="btn btn-toggle toggle-sidebar"
              type="button"
              onClick={onToggleSidebar}
            >
              <i className="gg-menu-right"></i>
            </button>
            <button
              className="btn btn-toggle sidenav-toggler"
              type="button"
              onClick={onToggleSidebar}
            >
              <i className="gg-menu-left"></i>
            </button>
          </div>
          <button
            className="topbar-toggler more"
            type="button"
            onClick={onToggleSidebar}
          >
            <i className="gg-more-vertical-alt"></i>
          </button>
        </div>
      </div>

      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">
            {navItems.map((item, index) => (
              <Fragment key={item.href}>
                {index === 1 ? (
                  <li className="nav-section">
                    <span className="sidebar-mini-icon">
                      <i className="fa fa-ellipsis-h"></i>
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
                    <i className={item.icon}></i>
                    <p>{item.label}</p>
                  </Link>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
