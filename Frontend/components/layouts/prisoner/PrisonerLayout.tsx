'use client';

import { ReactNode, useEffect, useState } from 'react';

import PrisonerFooter from './PrisonerFooter';
import PrisonerNavbar from './PrisonerNavbar';
import PrisonerSidebar from './PrisonerSidebar';

type PrisonerLayoutProps = {
  children: ReactNode;
};

export default function PrisonerLayout({ children }: PrisonerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      className={`layout-wrapper layout-content-navbar${
        sidebarOpen ? ' layout-menu-expanded' : ''
      }`}
    >
      <div className="layout-container">
        <PrisonerSidebar
          onCloseSidebar={() => setSidebarOpen(false)}
        />

        <div className="layout-page">
          <PrisonerNavbar
            onToggleSidebar={() => setSidebarOpen((current) => !current)}
            sidebarOpen={sidebarOpen}
          />
          <div className="content-wrapper">
            <main>{children}</main>
            <PrisonerFooter />
          </div>
        </div>
      </div>

      {sidebarOpen ? (
        <button
          aria-controls="layout-menu"
          aria-label="Close navigation menu overlay"
          className="layout-overlay layout-menu-toggle border-0"
          onClick={() => setSidebarOpen(false)}
          style={{ display: 'block' }}
          type="button"
        />
      ) : null}
    </div>
  );
}
