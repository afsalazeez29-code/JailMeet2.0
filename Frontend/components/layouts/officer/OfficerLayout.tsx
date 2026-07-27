'use client';

import { ReactNode, useEffect, useState } from 'react';

import OfficerFooter from './OfficerFooter';
import OfficerNavbar from './OfficerNavbar';
import OfficerSidebar from './OfficerSidebar';

type OfficerLayoutProps = {
  children: ReactNode;
};

export default function OfficerLayout({ children }: OfficerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      className={`layout-wrapper layout-content-navbar${
        sidebarOpen ? ' layout-menu-expanded' : ''
      }`}
    >
      <div className="layout-container">
        <OfficerSidebar
          onCloseSidebar={() => setSidebarOpen(false)}
        />

        <div className="layout-page">
          <OfficerNavbar
            onToggleSidebar={() => setSidebarOpen((current) => !current)}
            sidebarOpen={sidebarOpen}
          />
          <div className="content-wrapper">
            <main>{children}</main>
            <OfficerFooter />
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
