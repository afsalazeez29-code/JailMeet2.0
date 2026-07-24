'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { clearAccessToken } from '@features/auth/services/token.service';

type OfficerNavbarProps = {
  onToggleSidebar: () => void;
};

export default function OfficerNavbar({ onToggleSidebar }: OfficerNavbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    router.push('/login');
  };

  return (
    <div className="header">
      <div className="header-left">
        <button
          className="menu-icon dw dw-menu border-0 bg-transparent"
          type="button"
          aria-label="Toggle officer sidebar"
          onClick={onToggleSidebar}
        ></button>
        <button
          className="search-toggle-icon dw dw-search2 border-0 bg-transparent"
          type="button"
          aria-expanded={searchOpen}
          aria-label="Toggle search"
          onClick={() => setSearchOpen((current) => !current)}
        ></button>
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
                      Search
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
              className={`dropdown-menu dropdown-menu-right dropdown-menu-icon-list${
                profileOpen ? ' show' : ''
              }`}
            >
              <span className="dropdown-item">
                <i className="dw dw-id-card"></i> ID: Officer
              </span>
              <span className="dropdown-item">
                <i className="dw dw-envelope"></i> Email: officer@jailmeet.com
              </span>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" href="/officer/profile">
                <i className="dw dw-user1"></i> Profile
              </Link>
              <Link className="dropdown-item" href="/officer/profile/settings">
                <i className="dw dw-settings2"></i> Setting
              </Link>
              <button
                className="dropdown-item"
                type="button"
                onClick={handleLogout}
              >
                <i className="dw dw-logout"></i> Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
