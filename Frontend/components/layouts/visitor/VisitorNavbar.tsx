'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
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
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
  };

  return (
    <>
      <nav
        className={`layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme ${styles.visitorNavbar}`}
        id="layout-navbar"
      >
        <Link href="/" className="d-flex align-items-center me-3 ms-3 ms-xl-0">
          <img src="/images/logos/auth-logobl.png" alt="JailMeet home" className="navbar-brand-logo" />
        </Link>
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
          <button
            className="nav-item nav-link px-0 me-xl-4 border-0 bg-transparent"
            type="button"
            onClick={onToggleMenu}
          >
            <Menu
              aria-hidden="true"
              className={`${iconStyles.icon} ${iconStyles.navbar}`}
            />
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
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut
                  aria-hidden="true"
                  className={`${iconStyles.icon} ${iconStyles.navbar}`}
                />
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
