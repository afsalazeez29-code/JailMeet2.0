'use client';

import { ReactNode, useEffect } from 'react';

import OfficerFooter from './OfficerFooter';
import OfficerNavbar from './OfficerNavbar';
import OfficerSidebar from './OfficerSidebar';
import overlayStyles from '../shared/MobileSidebarOverlay.module.css';
import { useMobileSidebar } from '../shared/useMobileSidebar';
import s from './OfficerTheme.module.css';

type OfficerLayoutProps = {
  children: ReactNode;
};

export default function OfficerLayout({ children }: OfficerLayoutProps) {
  const { close: closeSidebar, isOpen: sidebarOpen, toggle: toggleSidebar } =
    useMobileSidebar();

  useEffect(() => {
    document.body.classList.remove(
      'index-page',
      'admin-page',
      'visitor-page',
      'officer-page',
      'prisoner-page',
    );
    document.body.classList.add('officer-page');

    return () => {
      document.body.classList.remove('officer-page');
    };
  }, []);

  return (
    <div
      className={`layout-wrapper layout-content-navbar ${s.dashboardRoot}${
        sidebarOpen ? ' layout-menu-expanded' : ''
      }`}
    >
      <div className={`layout-container ${s.dashboardBody}`}>
        <OfficerSidebar
          onCloseSidebar={closeSidebar}
        />

        <div className="layout-page">
          <OfficerNavbar
            onToggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          <div className="content-wrapper">
            <main className={s.mainContent}>{children}</main>
          </div>
        </div>
      </div>

      <OfficerFooter />

      {sidebarOpen ? (
        <button
          aria-controls="layout-menu"
          aria-label="Close navigation menu overlay"
          className={`layout-overlay layout-menu-toggle border-0 ${overlayStyles.overlay}`}
          onClick={closeSidebar}
          type="button"
        />
      ) : null}
    </div>
  );
}
