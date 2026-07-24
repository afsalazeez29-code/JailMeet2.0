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
    );
    document.body.classList.add('bg-theme', 'bg-theme1', 'prisoner-page');

    return () => {
      document.body.classList.remove(
        'bg-theme',
        'bg-theme1',
        'prisoner-page',
        'toggled',
      );
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('toggled', sidebarOpen);
  }, [sidebarOpen]);

  return (
    <div id="wrapper" className={sidebarOpen ? 'toggled' : undefined}>
      <div className="clearfix"></div>
      <PrisonerSidebar sidebarOpen={sidebarOpen} />
      <div className="content-wrapper">
        <div className="container-fluid">
          <PrisonerNavbar
            onToggleSidebar={() => setSidebarOpen((current) => !current)}
          />
          {children}
          <PrisonerFooter />
        </div>
      </div>
    </div>
  );
}
