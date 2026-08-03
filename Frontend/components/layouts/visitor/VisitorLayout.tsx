'use client';

import { ReactNode, useEffect } from 'react';

import VisitorFooter from './VisitorFooter';
import VisitorNavbar from './VisitorNavbar';
import VisitorSidebar from './VisitorSidebar';
import { useAuth } from '@features/auth/hooks/useAuth';
import overlayStyles from '../shared/MobileSidebarOverlay.module.css';
import { useMobileSidebar } from '../shared/useMobileSidebar';
import styles from './VisitorLayout.module.css';

type VisitorLayoutProps = {
  children: ReactNode;
};

export default function VisitorLayout({ children }: VisitorLayoutProps) {
  const { close: closeMenu, isOpen: menuOpen, toggle: toggleMenu } =
    useMobileSidebar();
  const { user } = useAuth();

  useEffect(() => {
    document.body.classList.remove(
      'index-page',
      'admin-page',
      'officer-page',
      'prisoner-page',
    );
    document.body.classList.add('visitor-page');

    return () => {
      document.body.classList.remove('visitor-page');
    };
  }, []);

  return (
    <div
      className={`layout-wrapper layout-content-navbar ${styles.dashboardRoot}${
        menuOpen ? ' layout-menu-expanded' : ''
      }`}
    >
      <div className={`layout-container ${styles.dashboardBody}`}>
        <VisitorSidebar onCloseMenu={closeMenu} />
        <div className="layout-page">
          <VisitorNavbar
            user={user}
            onToggleMenu={toggleMenu}
            menuOpen={menuOpen}
          />
          <div className="content-wrapper">
            <main className={styles.mainContent}>{children}</main>
          </div>
        </div>
      </div>
      
      <VisitorFooter />

      {menuOpen && (
        <button
          aria-label="Close navigation menu overlay"
          className={`layout-overlay layout-menu-toggle border-0 ${overlayStyles.overlay}`}
          onClick={closeMenu}
          type="button"
        />
      )}
    </div>
  );
}
