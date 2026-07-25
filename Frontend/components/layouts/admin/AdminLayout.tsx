'use client';

import { ReactNode, useEffect, useState } from 'react';

import AdminFooter from './AdminFooter';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import s from './AdminTheme.module.css';

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

const adminFontOverrides = `
  body.admin-page {
    font-family: var(--font-body, "Montserrat", sans-serif) !important;
  }

  body.admin-page p,
  body.admin-page a,
  body.admin-page li,
  body.admin-page label,
  body.admin-page .nav,
  body.admin-page .nav a,
  body.admin-page .navbar,
  body.admin-page .navbar a,
  body.admin-page .sidebar,
  body.admin-page .sidebar a,
  body.admin-page .card,
  body.admin-page .card p,
  body.admin-page .card-category,
  body.admin-page .page-inner {
    font-family: var(--font-body, "Montserrat", sans-serif) !important;
  }

  body.admin-page h1,
  body.admin-page h2,
  body.admin-page h3,
  body.admin-page h4,
  body.admin-page h5,
  body.admin-page h6 {
    font-family: var(--font-heading, "Raleway", sans-serif) !important;
  }

  body.admin-page input,
  body.admin-page select,
  body.admin-page textarea,
  body.admin-page button {
    font-family: var(--font-body, "Montserrat", sans-serif) !important;
  }
`;

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
      <style>{adminFontOverrides}</style>

      {/* 
        s.shell enforces the new visual root.
        The "wrapper" and "nav_open" classes must remain exactly as-is for Kaiadmin 
        mobile-toggle compatibility.
      */}
      <div className={`${s.shell} wrapper${sidebarOpen ? ' nav_open' : ''}`}>
        <AdminSidebar onToggleSidebar={toggleSidebar} />
        
        <div className="main-panel" style={{ width: '100%', maxWidth: '100%' }}>
          <AdminNavbar onToggleSidebar={toggleSidebar} />
          
          <main className="content">
            {children}
          </main>
          
          <AdminFooter />
        </div>
      </div>
    </>
  );
}
