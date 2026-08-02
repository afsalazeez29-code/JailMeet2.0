'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, WalletCards } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import iconStyles from '../../common/LucideIcon.module.css';
import { useAuth } from '@features/auth/hooks/useAuth';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { clearAccessToken } from '@features/auth/services/token.service';
import PrisonerProfilePill from './PrisonerProfilePill';
import NotificationBell from '@features/visitor-services/components/NotificationBell';
import s from './PrisonerTheme.module.css';

type PrisonerNavbarProps = {
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
};

const fallbackPrisonerImage = '/images/avatars/prisoner-default.png';

export default function PrisonerNavbar({
  onToggleSidebar,
  sidebarOpen = false,
}: PrisonerNavbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const displayName = user?.name ?? 'Prisoner';

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
  };

  return (
    <>
      <nav
        className={`layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme ${s.prisonerNavbar}`}
        id="layout-navbar"
        aria-label="Prisoner top navigation"
      >
        <Link href="/" className="d-none d-xl-flex align-items-center me-3 ms-xl-0">
          <img src="/images/logos/auth-logo.png" alt="JailMeet home" className="navbar-brand-logo" />
        </Link>

        <button
          className={`d-flex d-xl-none align-items-center border-0 bg-transparent p-0 ms-1 me-3 ${s.mobileLogoButton}`}
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
          aria-expanded={sidebarOpen}
          aria-controls="layout-menu"
        >
          <img src="/images/logos/auth-logo.png" alt="" className="navbar-brand-logo" aria-hidden="true" />
        </button>

        <div className={`navbar-nav-right d-flex align-items-center ${s.navbarNavRight}`} id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className={`nav-item ${s.profileActions}`}>
              <NotificationBell defaultHref="/prisoner/dashboard" />
              <PrisonerProfilePill
                displayName={displayName}
                avatarSrc={user?.profileImageUrl || fallbackPrisonerImage}
              />
              <button
                className={s.logoutButton}
                type="button"
                aria-label="Log out"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut aria-hidden="true" className={`${iconStyles.icon} ${iconStyles.navbar}`} />
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
