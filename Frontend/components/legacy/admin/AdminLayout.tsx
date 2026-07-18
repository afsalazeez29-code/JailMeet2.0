'use client';

import { ReactNode, useEffect, useState } from 'react';

import AdminFooter from './AdminFooter';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

type AdminLayoutProps = {
  children: ReactNode;
};

const adminStylesheets = [
  '/legacy/admin/assets1/css/bootstrap.min.css',
  '/legacy/admin/assets1/css/plugins.min.css',
  '/legacy/admin/assets1/css/kaiadmin.min.css',
  '/legacy/admin/assets1/css/fonts.min.css',
  '/legacy/admin/assets1/css/demo.css',
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.remove('index-page');
    document.body.classList.add('admin-page');

    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen((current) => !current);

  return (
    <>
      {adminStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}

      <div className={sidebarOpen ? 'wrapper nav_open' : 'wrapper'}>
        <AdminSidebar onToggleSidebar={toggleSidebar} />
        <div className="main-panel" style={{ width: '100%', maxWidth: '100%' }}>
          <AdminNavbar onToggleSidebar={toggleSidebar} />
          {children}
          <AdminFooter />
        </div>
      </div>
    </>
  );
}

