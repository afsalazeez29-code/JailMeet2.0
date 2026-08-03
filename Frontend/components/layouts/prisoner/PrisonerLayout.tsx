'use client';

import { ReactNode, useEffect } from 'react';

import PrisonerFooter from './PrisonerFooter';
import PrisonerNavbar from './PrisonerNavbar';
import PrisonerSidebar from './PrisonerSidebar';
import overlayStyles from '../shared/MobileSidebarOverlay.module.css';
import { useMobileSidebar } from '../shared/useMobileSidebar';
import s from './PrisonerTheme.module.css';

type PrisonerLayoutProps = {
  children: ReactNode;
};

export default function PrisonerLayout({ children }: PrisonerLayoutProps) {
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
    document.body.classList.add('prisoner-page');

    return () => {
      document.body.classList.remove('prisoner-page');
    };
  }, []);

  return (
    <div
      className={`layout-wrapper layout-content-navbar ${s.dashboardRoot}${
        sidebarOpen ? ' layout-menu-expanded' : ''
      }`}
    >
      <div className={`layout-container ${s.dashboardBody}`}>
        <PrisonerSidebar
          onCloseSidebar={closeSidebar}
        />

        <div className="layout-page">
          <PrisonerNavbar
            onToggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          <div className="content-wrapper">
            <main className={s.mainContent}>{children}</main>
          </div>
        </div>
      </div>

      <PrisonerFooter />

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
