'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Search } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';
import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { useAuth } from '@features/auth/hooks/useAuth';
import OfficerProfilePill from './OfficerProfilePill';
import pillStyles from './OfficerProfilePill.module.css';
import s from './OfficerTheme.module.css';

type OfficerNavbarProps = {
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
};

export default function OfficerNavbar({ onToggleSidebar, sidebarOpen = false }: OfficerNavbarProps) {
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
      <nav className={s.navbar} id="officer-navbar" aria-label="Officer top navigation">
        {/* Left: toggle + logo + search */}
        <div className={s.navbarLeft}>
          {/* Desktop Logo Link */}
          <Link href="/" className="d-none d-xl-flex align-items-center me-3">
            <img src="/images/logos/auth-logo.png" alt="JailMeet home" className="navbar-brand-logo" />
          </Link>

          {/* Mobile Logo Toggle */}
          <button
            className="d-flex d-xl-none align-items-center border-0 bg-transparent p-0 ms-1 me-3"
            type="button"
            onClick={onToggleSidebar}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="officer-sidebar"
          >
            <img src="/images/logos/auth-logo.png" alt="" className="navbar-brand-logo" aria-hidden="true" />
          </button>

          {/* Search toggle — preserved from original; form has no submit handler by design */}
          <button
            className={`search-toggle-icon ${s.toggleBtn}`}
            type="button"
            aria-expanded={searchOpen}
            aria-label="Toggle search"
            onClick={() => setSearchOpen((current) => !current)}
          >
            <Search
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.navbar}`}
            />
          </button>

          {/* Search dropdown — preserved from original officer template */}
          <div className={`header-search${searchOpen ? ' show' : ''}`}>
            <form>
              <div className="form-group mb-0">
                <div className="dropdown">
                  <button
                    className="dropdown-toggle no-arrow border-0 bg-transparent"
                    type="button"
                    aria-expanded={searchOpen}
                    onClick={() => setSearchOpen((current) => !current)}
                  />
                  <div
                    className={`dropdown-menu dropdown-menu-right${
                      searchOpen ? ' show' : ''
                    }`}
                  >
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-2 col-form-label">
                        From
                      </label>
                      <div className="col-sm-12 col-md-10">
                        <input
                          className="form-control form-control-sm form-control-line"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-2 col-form-label">
                        To
                      </label>
                      <div className="col-sm-12 col-md-10">
                        <input
                          className="form-control form-control-sm form-control-line"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-2 col-form-label">
                        Subject
                      </label>
                      <div className="col-sm-12 col-md-10">
                        <input
                          className="form-control form-control-sm form-control-line"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <button className="btn btn-primary" type="submit">
                        <AnimatedButtonText>Search</AnimatedButtonText>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right: profile pill + logout */}
        <div className={s.navbarRight}>
          {/*
            Profile pill — links to /officer/profile.
            displayName comes from the existing auth state (useAuth hook).
          */}
          <OfficerProfilePill displayName={user?.name ?? 'Officer'} />

          <button
            className={pillStyles.logoutButton}
            type="button"
            aria-label="Log out"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.navbar}`}
            />
          </button>
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
