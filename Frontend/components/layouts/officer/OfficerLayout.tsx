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
    document.body.classList.remove('index-page', 'admin-page', 'visitor-page');
    document.body.classList.add('officer-page');

    return () => {
      document.body.classList.remove('officer-page', 'sidebar-shown');
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('sidebar-shown', sidebarOpen);
  }, [sidebarOpen]);

  return (
    <>
      <OfficerNavbar
        onToggleSidebar={() => setSidebarOpen((current) => !current)}
      />
      <OfficerSidebar
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />
      <main className="main-container">{children}</main>
      <OfficerFooter />
    </>
  );
}
