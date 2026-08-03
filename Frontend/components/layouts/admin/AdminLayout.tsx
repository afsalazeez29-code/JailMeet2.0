'use client';

import { ReactNode, useEffect } from 'react';

import AdminFooter from './AdminFooter';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import overlayStyles from '../shared/MobileSidebarOverlay.module.css';
import { useMobileSidebar } from '../shared/useMobileSidebar';
import s from './AdminTheme.module.css';

type AdminLayoutProps = {
  children: ReactNode;
};

const adminStylesheets = [
  '/legacy/Active/visitor-boxicons.css',
  '/legacy/Active/visitor-core.css',
  '/legacy/Active/visitor-theme-default.css',
  '/legacy/Active/visitor-demo.css',
  '/legacy/Active/visitor-perfect-scrollbar.css',
  '/legacy/Active/admin-bootstrap.min.css',
  '/legacy/Active/admin-plugins.min.css',
  '/legacy/Active/admin-kaiadmin.min.css',
  '/legacy/Active/admin-fonts.min.css',
  '/legacy/Active/admin-demo.css',
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

  body.admin-page .layout-wrapper {
    width: 100% !important;
    min-height: 100vh;
  }

  body.admin-page .layout-navbar.bg-navbar-theme,
  body.admin-page .adminNavbar {
    background: #36255C !important;
    background-color: #36255C !important;
    color: #ffffff !important;
    border-color: #36255C !important;
  }

  body.admin-page .layout-menu {
    width: 16.25rem !important;
    min-width: 16.25rem !important;
    max-width: 16.25rem !important;
    flex: 0 0 16.25rem !important;
    background: #36255C !important;
    color: #ffffff !important;
  }

  body.admin-page .bg-menu-theme {
    background: #36255C !important;
    color: #ffffff !important;
  }

  body.admin-page .layout-menu.bg-menu-theme {
    background: #36255C !important;
    background-color: #36255C !important;
    color: #ffffff !important;
  }

  body.admin-page .layout-container {
    display: flex !important;
    width: 100% !important;
    min-height: 100vh;
  }

  body.admin-page .layout-page {
    display: flex !important;
    flex-direction: column !important;
    width: calc(100% - 16.25rem) !important;
    min-width: 0 !important;
    flex: 1 1 auto !important;
    padding: 0 !important;
    margin-left: 0 !important;
    background: #D2C3F6 !important;
  }

  body.admin-page .content-wrapper {
    display: flex !important;
    align-items: stretch !important;
    flex: 1 1 auto !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  body.admin-page .bg-menu-theme .menu-inner .menu-item {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  body.admin-page .menu-inner {
    width: 100% !important;
  }

  body.admin-page .menu-link {
    width: calc(100% - 2.3rem) !important;
    margin: 0.35rem 1.15rem !important;
    box-sizing: border-box;
  }

  body.admin-page .bg-menu-theme .menu-inner .menu-item .menu-link {
    display: inline-flex !important;
    align-items: center !important;
    gap: 10px !important;
    width: calc(100% - 2.3rem) !important;
    margin: 0.35rem 1.15rem !important;
    border: 1px solid rgba(255, 255, 255, 0.24) !important;
    border-radius: 999px !important;
    background: #36255C !important;
    color: #ffffff !important;
    text-decoration: none !important;
    cursor: pointer !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
    transition: transform 0.18s ease, background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease !important;
    flex-shrink: 0 !important;
    position: relative !important;
    touch-action: manipulation !important;
    -webkit-tap-highlight-color: transparent !important;
  }

  body.admin-page .bg-menu-theme .menu-inner .menu-item .menu-link .menu-icon {
    flex-shrink: 0 !important;
    margin: 0 !important;
    color: inherit !important;
  }

  body.admin-page .bg-menu-theme .menu-inner .menu-item .menu-link > div {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    flex-grow: 1 !important;
    text-align: left !important;
    margin: 0 !important;
  }

  body.admin-page .bg-menu-theme .menu-inner .menu-item.active > .menu-link {
    border-color: #ffffff !important;
    background-color: #ffffff !important;
    color: #36255C !important;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.14), 0 6px 14px rgba(54, 37, 92, 0.22) !important;
  }

  body.admin-page .bg-menu-theme .menu-inner .menu-item.active > .menu-link .menu-icon {
    color: #36255C !important;
  }

  body.admin-page .bg-menu-theme .menu-inner > .menu-item.active:before {
    display: none !important;
    content: none !important;
  }

  body.admin-page .bg-menu-theme .menu-inner .menu-item .menu-link:focus-visible,
  body.admin-page .layout-menu-toggle:focus-visible,
  body.admin-page .layout-overlay:focus-visible {
    outline: 2px solid #ff4a17 !important;
    outline-offset: 2px !important;
  }

  @media (hover: hover) and (pointer: fine) {
    body.admin-page .bg-menu-theme .menu-inner .menu-item:not(.active) .menu-link:hover {
      transform: translateY(-2px) !important;
      border-color: #ffffff !important;
      box-shadow: 0 4px 6px #ffffff !important;
    }
  }

  body.admin-page .layout-menu .menu-link[aria-disabled="true"] {
    background: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.14) !important;
    color: rgba(255, 255, 255, 0.52) !important;
  }

  @media (hover: none) and (pointer: coarse) {
    body.admin-page .bg-menu-theme .menu-inner .menu-item .menu-link:active {
      transform: translateX(2px) scale(0.99) !important;
    }
  }

  @media (max-width: 1199.98px) {
    body.admin-page .layout-menu {
      position: fixed !important;
      width: 16.25rem !important;
      transform: translate3d(-100%, 0, 0);
    }

    body.admin-page .layout-menu-expanded .layout-menu {
      transform: translate3d(0, 0, 0);
    }

    body.admin-page .layout-page {
      width: 100% !important;
    }
  }

  body.admin-page,
  body.admin-page .layout-wrapper,
  body.admin-page .layout-container,
  body.admin-page .content-wrapper {
    background: #D2C3F6 !important;
    background-color: #D2C3F6 !important;
  }

`;

export default function AdminLayout({ children }: AdminLayoutProps) {
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
    document.body.classList.add('admin-page');

    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  return (
    <>
      {adminStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
      <style>{adminFontOverrides}</style>

      <div
        className={`layout-wrapper layout-content-navbar ${s.dashboardRoot}${
          sidebarOpen ? ' layout-menu-expanded' : ''
        }`}
      >
        <div className={`layout-container ${s.dashboardBody}`}>
          <AdminSidebar onCloseSidebar={closeSidebar} />

          <div className="layout-page">
            <AdminNavbar
              onToggleSidebar={toggleSidebar}
              sidebarOpen={sidebarOpen}
            />
            <div className="content-wrapper">
              <main className={s.mainContent}>{children}</main>
            </div>
          </div>
        </div>

        <AdminFooter />

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
    </>
  );
}
