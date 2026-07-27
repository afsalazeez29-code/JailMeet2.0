import { ReactNode } from 'react';

import OfficerLayout from '../../components/layouts/officer/OfficerLayout';

type OfficerRouteLayoutProps = {
  children: ReactNode;
};

const officerStylesheets = [
  '/legacy/visitor/visitorpage/assets/vendor/fonts/boxicons.css',
  '/legacy/visitor/visitorpage/assets/vendor/css/core.css',
  '/legacy/visitor/visitorpage/assets/vendor/css/theme-default.css',
  '/legacy/visitor/visitorpage/assets/css/demo.css',
  '/legacy/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
  '/legacy/officer/vendors/styles/core.css',
  '/legacy/officer/vendors/styles/icon-font.min.css',
  '/legacy/officer/vendors/styles/style.css',
];

const officerFontOverrides = `
  body.officer-page {
    font-family: var(--font-body, "Montserrat", sans-serif);
  }

  body.officer-page h1,
  body.officer-page h2,
  body.officer-page h3,
  body.officer-page h4,
  body.officer-page h5,
  body.officer-page h6 {
    font-family: var(--font-heading, "Raleway", sans-serif);
  }

  body.officer-page input,
  body.officer-page select,
  body.officer-page textarea,
  body.officer-page button {
    font-family: var(--font-body, "Montserrat", sans-serif);
  }

  body.officer-page .layout-wrapper {
    width: 100% !important;
    min-height: 100vh;
  }

  body.officer-page .layout-navbar.bg-navbar-theme,
  body.officer-page .officerNavbar {
    background: #111111 !important;
    background-color: #111111 !important;
    color: #ffffff !important;
    border-color: #111111 !important;
  }

  body.officer-page .layout-menu {
    width: 16.25rem !important;
    min-width: 16.25rem !important;
    max-width: 16.25rem !important;
    flex: 0 0 16.25rem !important;
    background: #111111 !important;
    color: #ffffff !important;
  }

  body.officer-page .bg-menu-theme {
    background: #111111 !important;
    color: #ffffff !important;
  }

  body.officer-page .layout-menu.bg-menu-theme {
    background: #111111 !important;
    background-color: #111111 !important;
    color: #ffffff !important;
  }

  body.officer-page .layout-container {
    display: flex !important;
    width: 100% !important;
    min-height: 100vh;
  }

  body.officer-page .layout-page {
    display: flex !important;
    flex-direction: column !important;
    width: calc(100% - 16.25rem) !important;
    min-width: 0 !important;
    flex: 1 1 auto !important;
    padding: 0 !important;
    margin-left: 0 !important;
    background: transparent !important;
  }

  body.officer-page .content-wrapper {
    display: flex !important;
    align-items: stretch !important;
    flex: 1 1 auto !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  body.officer-page .bg-menu-theme .menu-inner .menu-item {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  body.officer-page .menu-inner {
    width: 100% !important;
  }

  body.officer-page .menu-link {
    width: calc(100% - 2.3rem) !important;
    min-height: 44px !important;
    margin: 0.35rem 1.15rem !important;
    padding: 0.625rem 1rem !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 10px !important;
    border-radius: 999px !important;
    box-sizing: border-box;
    line-height: 1.2 !important;
  }

  body.officer-page .layout-menu .menu-icon {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
  }

  body.officer-page .bg-menu-theme .menu-inner .menu-item .menu-link {
    display: inline-flex !important;
    align-items: center !important;
    gap: 10px !important;
    width: calc(100% - 2.3rem) !important;
    min-height: 44px !important;
    margin: 0.35rem 1.15rem !important;
    padding: 0.625rem 1rem !important;
    border: 1px solid #ffffff !important;
    border-radius: 999px !important;
    background: #ffffff !important;
    color: #111111 !important;
    text-decoration: none !important;
    cursor: pointer !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24) !important;
    transition:  translateY(-2px) , background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease !important;
    flex-shrink: 0 !important;
    position: relative !important;
    box-sizing: border-box !important;
    line-height: 1.2 !important;
    touch-action: manipulation !important;
    -webkit-tap-highlight-color: transparent !important;
  }

  body.officer-page .layout-menu .officer-submenu .menu-link {
    width: calc(100% - 3.8rem) !important;
    min-height: 40px !important;
    margin: 0.3rem 1.15rem 0.3rem 2.65rem !important;
    padding: 0.55rem 1rem !important;
  }

  body.officer-page .bg-menu-theme .menu-inner .menu-item .menu-link .menu-icon {
    flex-shrink: 0 !important;
    margin: 0 !important;
    color: inherit !important;
  }

  body.officer-page .bg-menu-theme .menu-inner .menu-item .menu-link > div {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    flex-grow: 1 !important;
    text-align: left !important;
    margin: 0 !important;
  }

  body.officer-page .bg-menu-theme .menu-inner .menu-item.active > .menu-link {
  transform: translateY(-2px) !important;
    border-color: #ff4a17 !important;
    background-color: #ffffff !important;
    color: #ff4a17 !important;
    box-shadow: 0 4px 6px #ff4a17 !important;  }

  body.officer-page .bg-menu-theme .menu-inner .menu-item.active > .menu-link .menu-icon {
    color: #ff4a17 !important;
  }

  body.officer-page .bg-menu-theme .menu-inner > .menu-item.active:before {
    display: none !important;
    content: none !important;
  }

  body.officer-page .bg-menu-theme .menu-inner .menu-item .menu-link:focus-visible,
  body.officer-page .layout-menu-toggle:focus-visible,
  body.officer-page .layout-overlay:focus-visible {
    outline: 2px solid #ff4a17 !important;
    outline-offset: 2px !important;
  }

  @media (hover: hover) and (pointer: fine) {
    body.officer-page .bg-menu-theme .menu-inner .menu-item:not(.active) .menu-link:hover {
      transform: translateY(-2px) !important;
      border-color: #111111 !important;
      box-shadow: 0 4px 6px #111111 !important;
    }
  }

  body.officer-page .layout-menu .menu-link[aria-disabled="true"] {
    background: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
    color: rgba(255, 255, 255, 0.48) !important;
  }

  @media (hover: none) and (pointer: coarse) {
    body.officer-page .bg-menu-theme .menu-inner .menu-item .menu-link:active {
      transform: translateX(2px) scale(0.99) !important;
    }
  }

  @media (max-width: 1199.98px) {
    body.officer-page .layout-menu {
      position: fixed !important;
      width: 16.25rem !important;
      transform: translate3d(-100%, 0, 0);
    }

    body.officer-page .layout-menu-expanded .layout-menu {
      transform: translate3d(0, 0, 0);
    }

    body.officer-page .layout-page {
      width: 100% !important;
    }
  }

`;

export default function OfficerRouteLayout({
  children,
}: OfficerRouteLayoutProps) {
  return (
    <>
      <link
        href="/images/logos/favicon.jpg"
        rel="icon"
        type="image/jpeg"
      />
      {officerStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
      <style>{officerFontOverrides}</style>
      <OfficerLayout>{children}</OfficerLayout>
    </>
  );
}
