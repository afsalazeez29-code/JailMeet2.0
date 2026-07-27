'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { LogOut } from 'lucide-react';

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
  menuOpen?: boolean;
};

export default function VisitorNavbar({ user, onToggleMenu, menuOpen = false }: VisitorNavbarProps) {
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
        {/* Desktop Logo Link */}
        <Link href="/" className="d-none d-xl-flex align-items-center me-3 ms-xl-0">
          <img src="/images/logos/auth-logobl.png" alt="JailMeet home" className="navbar-brand-logo" />
        </Link>

        {/* Mobile Logo Toggle (acts as menu trigger on small screens) */}
        <button
          className={`d-flex d-xl-none align-items-center border-0 bg-transparent p-0 ms-1 me-3 ${styles.mobileLogoButton}`}
          type="button"
          onClick={onToggleMenu}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          aria-controls="layout-menu"
        >
          <img src="/images/logos/auth-logobl.png" alt="" className="navbar-brand-logo" aria-hidden="true" />
        </button>

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
