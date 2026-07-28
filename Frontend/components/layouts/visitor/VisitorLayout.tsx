'use client';

import { ReactNode, useEffect, useState } from 'react';

import VisitorFooter from './VisitorFooter';
import VisitorNavbar from './VisitorNavbar';
import VisitorSidebar from './VisitorSidebar';
import { useAuth } from '@features/auth/hooks/useAuth';
import styles from './VisitorLayout.module.css';

type VisitorLayoutProps = {
  children: ReactNode;
};

export default function VisitorLayout({ children }: VisitorLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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
        <VisitorSidebar onCloseMenu={() => setMenuOpen(false)} />
        <div className="layout-page">
          <VisitorNavbar
            user={user}
            onToggleMenu={() => setMenuOpen((current) => !current)}
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
          className="layout-overlay layout-menu-toggle border-0"
          onClick={() => setMenuOpen(false)}
          style={{ display: 'block' }}
          type="button"
        />
      )}
    </div>
  );
}
