'use client';

import { useRouter } from 'next/navigation';

import { clearAccessToken } from '@features/auth/services/token.service';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { AuthUser } from '@features/auth/types';
import VisitorProfilePill from '@features/visitor-profile/components/VisitorProfilePill';
import styles from '@features/visitor-profile/components/VisitorProfilePill.module.css';

type VisitorNavbarProps = {
  user: AuthUser | null;
  onToggleMenu: () => void;
};

export default function VisitorNavbar({ user, onToggleMenu }: VisitorNavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
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
          <li className={`nav-item ${styles.profileActions}`}>
            <VisitorProfilePill
              fullName={user?.name ?? 'Visitor'}
              profileImage={null}
            />
            <button
              className={styles.logoutButton}
              type="button"
              aria-label="Log out"
              onClick={handleLogout}
            >
              <i className="bx bx-power-off" aria-hidden="true"></i>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

