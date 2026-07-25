'use client';

import { ReactNode, useEffect, useState } from 'react';

import PrisonerFooter from './PrisonerFooter';
import PrisonerNavbar from './PrisonerNavbar';
import PrisonerSidebar from './PrisonerSidebar';
import s from './PrisonerTheme.module.css';

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
    <div id="wrapper" className={`${s.shell}${sidebarOpen ? ' toggled' : ''}`}>
      <PrisonerSidebar sidebarOpen={sidebarOpen} />
      
      {/* Mobile overlay */}
      <button
        className={`${s.overlay}${sidebarOpen ? ` ${s.overlayVisible}` : ''}`}
        type="button"
        aria-label="Close prisoner menu overlay"
        onClick={() => setSidebarOpen(false)}
      />

      <div className={s.main}>
        <div className="content-wrapper">
          <div className="container-fluid">
            <PrisonerNavbar
              onToggleSidebar={() => setSidebarOpen((current) => !current)}
            />
            <main className={s.content}>
              {children}
            </main>
            <PrisonerFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
