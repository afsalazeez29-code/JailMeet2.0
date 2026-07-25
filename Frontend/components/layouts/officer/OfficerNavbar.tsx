'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IdCard, LogOut, Mail, Menu, Search, Settings, UserRound } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
import { AnimatedButtonText } from '@components/common/AnimatedButtonText';
import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';

type OfficerNavbarProps = {
  onToggleSidebar: () => void;
};

export default function OfficerNavbar({ onToggleSidebar }: OfficerNavbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
  };

  return (
    <div className="header">
      <div className="header-left d-flex align-items-center">
        <Link href="/" className="d-flex align-items-center me-2 ms-2 ms-md-0">
          <img src="/images/logos/auth-logobl.png" alt="JailMeet home" className="navbar-brand-logo" />
        </Link>
        <button
          className="menu-icon border-0 bg-transparent"
          type="button"
          aria-label="Toggle officer sidebar"
          onClick={onToggleSidebar}
        >
          <Menu
            aria-hidden="true"
            className={`${iconStyles.icon} ${iconStyles.navbar}`}
          />
        </button>
        <button
          className="search-toggle-icon border-0 bg-transparent"
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
        <div className={`header-search${searchOpen ? ' show' : ''}`}>
          <form>
            <div className="form-group mb-0">
              <div className="dropdown">
                <button
                  className="dropdown-toggle no-arrow border-0 bg-transparent"
                  type="button"
                  aria-expanded={searchOpen}
                  onClick={() => setSearchOpen((current) => !current)}
                ></button>
                <div
                  className={`dropdown-menu dropdown-menu-right${searchOpen ? ' show' : ''
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

      <div className="header-right">
        <div className="user-notification">
          <div className="dropdown">
            <div className="dropdown-menu dropdown-menu-right">
              <div className="notification-list mx-h-350 customscroll"></div>
            </div>
          </div>
        </div>

        <div className="user-info-dropdown">
          <div className="dropdown">
            <button
              className="dropdown-toggle border-0 bg-transparent"
              type="button"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((current) => !current)}
            >
              <span className="user-icon">
                <img src="/images/officer/officer-profile.png" alt="Officer profile" />
              </span>
              <span className="user-name">Officer</span>
            </button>
            <div
              className={`dropdown-menu dropdown-menu-right dropdown-menu-icon-list${profileOpen ? ' show' : ''
                }`}
            >
              <span className="dropdown-item">
                <IdCard
                  aria-hidden="true"
                  className={`${iconStyles.icon} ${iconStyles.action}`}
                />{' '}
                ID: Officer
              </span>
              <span className="dropdown-item">
                <Mail
                  aria-hidden="true"
                  className={`${iconStyles.icon} ${iconStyles.action}`}
                />{' '}
                Email: officer@jailmeet.com
              </span>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" href="/officer/profile">
                <UserRound
                  aria-hidden="true"
                  className={`${iconStyles.icon} ${iconStyles.action}`}
                />{' '}
                Profile
              </Link>
              <Link className="dropdown-item" href="/officer/profile/settings">
                <Settings
                  aria-hidden="true"
                  className={`${iconStyles.icon} ${iconStyles.action}`}
                />{' '}
                Setting
              </Link>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut
                  aria-hidden="true"
                  className={`${iconStyles.icon} ${iconStyles.action}`}
                />{' '}
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

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
