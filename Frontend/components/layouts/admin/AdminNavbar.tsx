'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, MoreVertical, PanelLeftClose, Search } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';

type AdminNavbarProps = {
  onToggleSidebar: () => void;
};

export default function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
  };

  return (
    <div className="main-header">
      <div className="main-header-logo">
        <div className="logo-header" data-background-color="dark">
          <Link href="/" className="logo d-flex align-items-center">
            <img
              src="/images/logos/auth-logobl.png"
              alt="JailMeet home"
              className="navbar-brand-logo"
            />
          </Link>
          <div className="nav-toggle">
            <button
              className="btn btn-toggle toggle-sidebar"
              type="button"
              onClick={onToggleSidebar}
            >
              <Menu
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.navbar}`}
              />
            </button>
            <button
              className="btn btn-toggle sidenav-toggler"
              type="button"
              onClick={onToggleSidebar}
            >
              <PanelLeftClose
                aria-hidden="true"
                className={`${iconStyles.icon} ${iconStyles.navbar}`}
              />
            </button>
          </div>
          <button
            className="topbar-toggler more"
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
          >
            <MoreVertical
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.navbar}`}
            />
          </button>
        </div>
      </div>

      <nav
        className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom"
        style={{ right: '1px', width: '100%', maxWidth: '100%' }}
      >
        <div className="container-fluid" style={{ width: '100%', maxWidth: '100%' }}>
          <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
            <div className="input-group">
              <div className="input-group-prepend">
                <button type="submit" className="btn btn-search pe-1">
                  <Search
                    aria-hidden="true"
                    className={`search-icon ${iconStyles.icon} ${iconStyles.action}`}
                  />
                </button>
              </div>
              <input
                type="text"
                placeholder="Search ..."
                className="form-control"
              />
            </div>
          </nav>

          <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
            <li className="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
              <button
                className="nav-link dropdown-toggle"
                type="button"
                aria-expanded={searchOpen}
                aria-haspopup="true"
                onClick={() => setSearchOpen((current) => !current)}
              >
                <Search
                  aria-hidden="true"
                  className={`${iconStyles.icon} ${iconStyles.navbar}`}
                />
              </button>
              <ul
                className={`dropdown-menu dropdown-search animated fadeIn${searchOpen ? ' show' : ''
                  }`}
              >
                <li>
                  <form className="navbar-left navbar-form nav-search">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search ..."
                        className="form-control"
                      />
                    </div>
                  </form>
                </li>
              </ul>
            </li>

            <li className="nav-item topbar-user dropdown hidden-caret">
              <button
                className="dropdown-toggle profile-pic"
                type="button"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((current) => !current)}
              >
                <div className="avatar-sm">
                  <span className="avatar-img rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white">
                    A
                  </span>
                </div>
                <span className="profile-username">
                  <span className="op-7">Hi,</span>
                  <span className="fw-bold">Admin</span>
                </span>
              </button>
              <ul
                className={`dropdown-menu dropdown-user animated fadeIn${profileOpen ? ' show' : ''
                  }`}
              >
                <li>
                  <div className="dropdown-user-scroll scrollbar-outer">
                    <div className="user-box">
                      <div className="avatar-lg">
                        <span className="avatar-img rounded d-flex align-items-center justify-content-center bg-secondary text-white">
                          A
                        </span>
                      </div>
                      <div className="u-text">
                        <h4>Admin</h4>
                        <p className="text-muted">admin@jailmeet.com</p>
                        <Link
                          href="/admin/profile"
                          className="btn btn-xs btn-secondary btn-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" href="/admin/profile">
                      My Profile
                    </Link>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" href="/admin/settings">
                      Account Setting
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => setLogoutOpen(true)}
                    >
                      Logout
                    </button>
                  </div>
                </li>
              </ul>
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
    </div>
  );
}
