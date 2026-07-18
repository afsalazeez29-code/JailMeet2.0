'use client';

import { ReactNode, useEffect, useState } from 'react';

import VisitorFooter from './VisitorFooter';
import VisitorNavbar from './VisitorNavbar';
import VisitorSidebar from './VisitorSidebar';

type VisitorLayoutProps = {
  children: ReactNode;
};

export default function VisitorLayout({ children }: VisitorLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <VisitorSidebar />
        <div className="layout-page">
          <VisitorNavbar onToggleMenu={() => setMenuOpen((current) => !current)} />
          <div className="content-wrapper">
            {children}
            <VisitorFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
