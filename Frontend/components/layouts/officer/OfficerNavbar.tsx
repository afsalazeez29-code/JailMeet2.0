'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Search } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';
import { useAuth } from '@features/auth/hooks/useAuth';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { clearAccessToken } from '@features/auth/services/token.service';
import OfficerProfilePill from './OfficerProfilePill';
import s from './OfficerTheme.module.css';

type OfficerNavbarProps = {
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
};

export default function OfficerNavbar({
  onToggleSidebar,
  sidebarOpen = false,
}: OfficerNavbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
  };

  return (
    <>
      <nav
        className={`layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme ${s.officerNavbar}`}
        id="layout-navbar"
        aria-label="Officer top navigation"
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

        <div className={s.searchArea}>
          <button
            className={s.searchToggle}
            type="button"
            aria-expanded={searchOpen}
            aria-label="Toggle search"
            onClick={() => setSearchOpen((current) => !current)}
          >
            <Search aria-hidden="true" className={`${iconStyles.icon} ${iconStyles.navbar}`} />
          </button>

          <div className={`${s.searchDropdown}${searchOpen ? ` ${s.searchDropdownOpen}` : ''}`}>
            <form onSubmit={(event) => event.preventDefault()}>
              <div className="form-group row">
                <label className="col-sm-12 col-md-2 col-form-label" htmlFor="officer-search-from">
                  From
                </label>
                <div className="col-sm-12 col-md-10">
                  <input
                    className="form-control form-control-sm form-control-line"
                    id="officer-search-from"
                    type="text"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-2 col-form-label" htmlFor="officer-search-to">
                  To
                </label>
                <div className="col-sm-12 col-md-10">
                  <input
                    className="form-control form-control-sm form-control-line"
                    id="officer-search-to"
                    type="text"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-2 col-form-label" htmlFor="officer-search-subject">
                  Subject
                </label>
                <div className="col-sm-12 col-md-10">
                  <input
                    className="form-control form-control-sm form-control-line"
                    id="officer-search-subject"
                    type="text"
                  />
                </div>
              </div>
              <div className="text-right">
                <button className="btn btn-primary" type="submit">
                  <AnimatedButtonText>Search</AnimatedButtonText>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className={`nav-item ${s.profileActions}`}>
              <OfficerProfilePill displayName={user?.name ?? 'Officer'} />
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
