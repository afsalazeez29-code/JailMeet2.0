'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';

import LogoutConfirmModal from '../../common/LogoutConfirmModal';
import NavbarSearch from '../../common/NavbarSearch';
import iconStyles from '../../common/LucideIcon.module.css';
import { useAuth } from '@features/auth/hooks/useAuth';
import { navigateToLogin } from '@features/auth/services/navigation.service';
import { clearAccessToken } from '@features/auth/services/token.service';
import OfficerProfilePill from './OfficerProfilePill';
import NotificationBell from '@features/visitor-services/components/NotificationBell';
import s from './OfficerTheme.module.css';

type OfficerNavbarProps = {
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
};

const fallbackOfficerImage = '/images/avatars/officer-default.PNG';

export default function OfficerNavbar({
  onToggleSidebar,
  sidebarOpen = false,
}: OfficerNavbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAccessToken();
    navigateToLogin(router, 'push');
  };

  const handleSearch = (value: string) => {
    const query = value.trim();
    if (query.length >= 2) router.push(`/officer/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <nav
        className={`layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme ${s.officerNavbar}`}
        id="layout-navbar"
        aria-label="Officer top navigation"
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

        <NavbarSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Search"
        />

        <div className={`navbar-nav-right d-flex align-items-center ${s.navbarNavRight}`} id="navbar-collapse">
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            <li className={`nav-item ${s.profileActions}`}>
              <NotificationBell defaultHref="/officer/dashboard" />
              <OfficerProfilePill displayName={user?.name ?? 'Officer'} avatarSrc={user?.profileImageUrl || fallbackOfficerImage} />
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
