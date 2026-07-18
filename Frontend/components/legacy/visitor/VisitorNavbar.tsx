'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { clearAccessToken } from '@/lib/auth';

type VisitorNavbarProps = {
  onToggleMenu: () => void;
};

export default function VisitorNavbar({ onToggleMenu }: VisitorNavbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    router.push('/login');
  };

  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
      style={{
        borderLeftWidth: '10px',
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <button
          className="nav-item nav-link px-0 me-xl-4 border-0 bg-transparent"
          type="button"
          onClick={onToggleMenu}
        >
          <i className="bx bx-menu bx-sm"></i>
        </button>
      </div>

      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <button
              className="nav-link dropdown-toggle hide-arrow border-0 bg-transparent"
              type="button"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((current) => !current)}
            >
              <div className="avatar avatar-online">
                <img
                  src="/legacy/visitor/visitorpage/html/userlogo.webp"
                  alt="Visitor avatar"
                  className="w-px-40 h-auto rounded-circle"
                />
              </div>
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-end${
                profileOpen ? ' show' : ''
              }`}
            >
              <li>
                <div className="dropdown-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img
                          src="/legacy/visitor/visitorpage/html/userlogo.webp"
                          alt="Visitor avatar"
                          className="w-px-40 h-auto rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-semibold d-block">visitor@jailmeet.com</span>
                      <small className="text-muted">Visitor ID: Visitor</small>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <Link className="dropdown-item" href="/visitor/profile">
                  <i className="bx bx-user me-2"></i>
                  <span className="align-middle">My Profile</span>
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/visitor/settings">
                  <i className="bx bx-cog me-2"></i>
                  <span className="align-middle">Settings</span>
                </Link>
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={handleLogout}>
                  <i className="bx bx-power-off me-2"></i>
                  <span className="align-middle">Log Out</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
