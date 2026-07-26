'use client';

import { ReactNode, useEffect, useState } from 'react';

import VisitorFooter from './VisitorFooter';
import VisitorNavbar from './VisitorNavbar';
import VisitorSidebar from './VisitorSidebar';
import { useAuth } from '@features/auth/hooks/useAuth';

type VisitorLayoutProps = {
  children: ReactNode;
};

export default function VisitorLayout({ children }: VisitorLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    document.body.classList.remove('index-page', 'admin-page');
    document.body.classList.add('visitor-page');

    return () => {
      document.body.classList.remove('visitor-page');
    };
  }, []);

  return (
    <div
      className={`layout-wrapper layout-content-navbar${
        menuOpen ? ' layout-menu-expanded' : ''
      }`}
    >
      <div className="layout-container">
        <VisitorSidebar onCloseMenu={() => setMenuOpen(false)} />
        <div className="layout-page">
          <VisitorNavbar
            user={user}
            onToggleMenu={() => setMenuOpen((current) => !current)}
            menuOpen={menuOpen}
          />
          <div className="content-wrapper">
            {children}
            <VisitorFooter />
          </div>
        </div>
      </div>
      
      {/* Overlay to close menu on mobile */}
      {menuOpen && (
        <div 
          className="layout-overlay layout-menu-toggle" 
          onClick={() => setMenuOpen(false)}
          style={{ display: 'block' }}
        />
      )}
    </div>
  );
}
