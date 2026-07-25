'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, Search, WalletCards } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import PrisonerProfilePill from './PrisonerProfilePill';
import s from './PrisonerTheme.module.css';

type PrisonerNavbarProps = {
  onToggleSidebar: () => void;
};

const fallbackPrisonerImage = '/images/avatars/prisoner-fallback.png';

export default function PrisonerNavbar({ onToggleSidebar }: PrisonerNavbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
  };

  return (
    <>
      <nav className={s.navbar} aria-label="Prisoner top navigation">
        {/* Left: toggle + logo + search */}
        <div className={s.navbarLeft}>
          <button
            className={s.toggleBtn}
            type="button"
            aria-label="Toggle prisoner sidebar"
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
              style={{ height: '30px' }}
            />
          </Link>

          {/* Search form — exact structure and behaviour preserved */}
          <form
            className={`search-bar d-flex align-items-center${searchOpen ? ' show' : ''}`}
            onSubmit={(event) => event.preventDefault()}
            style={{ marginLeft: '10px' }}
          >
            <input
              className={`form-control ${!searchOpen ? 'd-none' : ''}`}
              placeholder="Enter keywords"
              type="text"
            />
            <button
              className={s.toggleBtn}
              type="button"
              aria-label="Toggle search"
              onClick={() => setSearchOpen((current) => !current)}
            >
              <Search
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.navbar}`}
              />
            </button>
          </form>
        </div>

        {/* Right: profile dropdown */}
        <div className={s.navbarRight}>
          <div className="dropdown">
            <PrisonerProfilePill
              displayName="Prisoner"
              avatarSrc={fallbackPrisonerImage}
              onClick={() => setProfileOpen((current) => !current)}
              ariaExpanded={profileOpen}
            />
            <ul
              className={`dropdown-menu dropdown-menu-right${
                profileOpen ? ' show' : ''
              }`}
              style={{ position: 'absolute', top: '100%', right: 0 }}
            >
              <li className="dropdown-item user-details">
                <div className="media align-items-center">
                  <div className="avatar me-3">
                    <img
                      className="align-self-start"
                      src={fallbackPrisonerImage}
                      alt="Prisoner avatar"
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                    />
                  </div>
                  <div className="media-body">
                    <h6 className="mt-2 user-title mb-0">Prisoner ID: Prisoner</h6>
                    <p className="user-subtitle text-muted mb-0">Prisoner Name: Prisoner</p>
                  </div>
                </div>
              </li>
              <li className="dropdown-divider"></li>
              <li className="dropdown-item">
                <Link href="/prisoner/dashboard" className="text-dark d-flex align-items-center">
                  <WalletCards
                    aria-hidden="true"
                    className={`me-2 ${iconStyles.icon} ${iconStyles.action}`}
                  />{' '}
                  Account
                </Link>
              </li>
              <li className="dropdown-divider"></li>
              <li className="dropdown-item">
                <button
                  className="text-dark border-0 bg-transparent p-0 d-flex align-items-center w-100"
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    setLogoutOpen(true);
                  }}
                >
                  <LogOut
                    aria-hidden="true"
                    className={`me-2 ${iconStyles.icon} ${iconStyles.action}`}
                  />{' '}
                  Logout
                </button>
              </li>
            </ul>
          </div>
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
