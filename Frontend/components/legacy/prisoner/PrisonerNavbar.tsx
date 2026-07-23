'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { clearAccessToken } from '@/lib/auth';

type PrisonerNavbarProps = {
  onToggleSidebar: () => void;
};

const fallbackPrisonerImage = '/images/avatars/prisoner-fallback.png';

export default function PrisonerNavbar({ onToggleSidebar }: PrisonerNavbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    router.push('/login');
  };

  return (
    <header className="topbar-nav">
      <nav className="navbar navbar-expand fixed-top">
        <ul className="navbar-nav mr-auto align-items-center">
          <li className="nav-item">
            <button
              className="nav-link toggle-menu border-0 bg-transparent"
              type="button"
              aria-label="Toggle prisoner sidebar"
              onClick={onToggleSidebar}
            >
              <i className="icon-menu menu-icon"></i>
            </button>
          </li>
          <li className="nav-item">
            <form
              className={`search-bar${searchOpen ? ' show' : ''}`}
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                className="form-control"
                placeholder="Enter keywords"
                type="text"
              />
              <button
                className="border-0 bg-transparent"
                type="button"
                aria-label="Toggle search"
                onClick={() => setSearchOpen((current) => !current)}
              >
                <i className="icon-magnifier"></i>
              </button>
            </form>
          </li>
        </ul>

        <ul className="navbar-nav align-items-center right-nav-link">
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle dropdown-toggle-nocaret border-0 bg-transparent"
              type="button"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((current) => !current)}
            >
              <span className="user-profile">
                <img
                  src={fallbackPrisonerImage}
                  className="img-circle"
                  alt="Prisoner avatar"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
              </span>
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-right${
                profileOpen ? ' show' : ''
              }`}
            >
              <li className="dropdown-item user-details">
                <div className="media">
                  <div className="avatar">
                    <img
                      className="align-self-start mr-3"
                      src={fallbackPrisonerImage}
                      alt="Prisoner avatar"
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div className="media-body">
                    <h6 className="mt-2 user-title">Prisoner ID: Prisoner</h6>
                    <p className="user-subtitle">Prisoner Name: Prisoner</p>
                  </div>
                </div>
              </li>
              <li className="dropdown-divider"></li>
              <li className="dropdown-item">
                <Link href="/prisoner/dashboard" className="text-white">
                  <i className="icon-wallet mr-2"></i> Account
                </Link>
              </li>
              <li className="dropdown-divider"></li>
              <li className="dropdown-item">
                <button
                  className="text-white border-0 bg-transparent p-0"
                  type="button"
                  onClick={handleLogout}
                >
                  <i className="icon-power mr-2"></i> Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}
