'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Search } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
import { useAuth } from '@features/auth/hooks/useAuth';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { clearAccessToken } from '@features/auth/services/token.service';
import AdminProfilePill from './AdminProfilePill';
import s from './AdminTheme.module.css';

type AdminNavbarProps = {
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
};

export default function AdminNavbar({
  onToggleSidebar,
  sidebarOpen = false,
}: AdminNavbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const displayName = user?.name ?? 'Admin';

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
  };

  return (
    <>
      <nav
        className={`layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme ${s.adminNavbar}`}
        id="layout-navbar"
        aria-label="Admin top navigation"
      >
        <Link href="/" className="d-none d-xl-flex align-items-center me-3 ms-xl-0">
          <img src="/images/logos/auth-logo.png" alt="JailMeet home" className="navbar-brand-logo" />
        </Link>

        <button
          className={`d-flex d-xl-none align-items-center border-0 bg-transparent p-0 ms-1 me-3 ${s.mobileLogoButton}`}
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
          aria-expanded={sidebarOpen}
          aria-controls="layout-menu"
        >
          <img src="/images/logos/auth-logo.png" alt="" className="navbar-brand-logo" aria-hidden="true" />
        </button>

        <form className={s.searchForm} onSubmit={(event) => event.preventDefault()}>
          <Search aria-hidden="true" className={`${s.searchIcon} ${iconStyles.icon} ${iconStyles.action}`} />
          <input
            aria-label="Search"
            className={s.searchInput}
            placeholder="Search"
            type="search"
          />
        </form>

        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className={`nav-item ${s.profileActions}`}>
              <div className={s.profileDropdown}>
                <AdminProfilePill
                  displayName={displayName}
                  onClick={() => setProfileOpen((current) => !current)}
                  ariaExpanded={profileOpen}
                />
                <ul
                  className={`dropdown-menu dropdown-user ${s.profileMenu}${
                    profileOpen ? ' show' : ''
                  }`}
                >
                  <li>
                    <div className={s.profileMenuHeader}>
                      <span className={s.profileMenuAvatar} aria-hidden="true">
                        A
                      </span>
                      <div>
                        <h4>{displayName}</h4>
                        <p>{user?.email ?? 'admin@jailmeet.com'}</p>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-divider" />
                  <li>
                    <Link className="dropdown-item" href="/admin/profile">
                      My Profile
                    </Link>
                  </li>
                  <li className="dropdown-divider" />
                  <li>
                    <Link className="dropdown-item" href="/admin/settings">
                      Account Setting
                    </Link>
                  </li>
                </ul>
              </div>

              <button
                className={s.logoutButton}
                type="button"
                aria-label="Log out"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut aria-hidden="true" className={`${iconStyles.icon} ${iconStyles.navbar}`} />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          handleLogout();
        }}
      />
    </>
  );
}
