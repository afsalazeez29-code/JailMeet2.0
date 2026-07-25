'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, Search } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';
import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import OfficerProfilePill from './OfficerProfilePill';
import pillStyles from './OfficerProfilePill.module.css';
import s from './OfficerTheme.module.css';

type OfficerNavbarProps = {
  onToggleSidebar: () => void;
};

export default function OfficerNavbar({ onToggleSidebar }: OfficerNavbarProps) {
  const router = useRouter();
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
          <button
            className={s.toggleBtn}
            type="button"
            aria-label="Toggle officer sidebar"
            onClick={onToggleSidebar}
          >
            <Menu
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.navbar}`}
            />
          </button>

          <Link href="/" aria-label="JailMeet home" className="d-flex align-items-center">
            <img
              src="/images/logos/auth-logobl.png"
              alt="JailMeet home"
              className="navbar-brand-logo"
            />
          </Link>

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
            Profile pill — non-clickable.
            Evidence for non-clickable: /officer/profile and /officer/profile/settings
            both confirmed absent (Test-Path returns False for both).
            The original dropdown contained hard-coded fake data ("Officer", "officer@jailmeet.com")
            with no real auth data source. Logout action is preserved via the dedicated button below.
          */}
          <OfficerProfilePill displayName="Officer" />

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
