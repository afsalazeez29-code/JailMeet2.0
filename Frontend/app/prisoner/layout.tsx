import { ReactNode } from 'react';

import PrisonerLayout from '../../components/layouts/prisoner/PrisonerLayout';

type PrisonerRouteLayoutProps = {
  children: ReactNode;
};

const prisonerStylesheets = [
  '/legacy/visitor/visitorpage/assets/vendor/fonts/boxicons.css',
  '/legacy/visitor/visitorpage/assets/vendor/css/core.css',
  '/legacy/visitor/visitorpage/assets/vendor/css/theme-default.css',
  '/legacy/visitor/visitorpage/assets/css/demo.css',
  '/legacy/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
  '/legacy/prisoner/assets/plugins/simplebar/css/simplebar.css',
  '/legacy/prisoner/assets/css/bootstrap.min.css',
  '/legacy/prisoner/assets/css/animate.css',
  '/legacy/prisoner/assets/css/icons.css',
  '/legacy/prisoner/assets/css/sidebar-menu.css',
  '/legacy/prisoner/assets/css/app-style.css',
];

const prisonerFontOverrides = `
  body.prisoner-page {
    font-family: var(--font-body, "Montserrat", sans-serif);
  }

  body.prisoner-page h1,
  body.prisoner-page h2,
  body.prisoner-page h3,
  body.prisoner-page h4,
  body.prisoner-page h5,
  body.prisoner-page h6 {
    font-family: var(--font-heading, "Raleway", sans-serif);
  }

  body.prisoner-page input,
  body.prisoner-page select,
  body.prisoner-page textarea,
  body.prisoner-page button {
    font-family: var(--font-body, "Montserrat", sans-serif);
  }

  body.prisoner-page .layout-wrapper {
    width: 100% !important;
    min-height: 100vh;
  }

  body.prisoner-page .layout-navbar.bg-navbar-theme,
  body.prisoner-page .prisonerNavbar {
    background: #ff4a17 !important;
    background-color: #ff4a17 !important;
    color: #ffffff !important;
    border-color: #ff4a17 !important;
  }

  body.prisoner-page .layout-menu {
    width: 16.25rem !important;
    min-width: 16.25rem !important;
    max-width: 16.25rem !important;
    flex: 0 0 16.25rem !important;
    background: #ff4a17 !important;
    color: #ffffff !important;
  }

  body.prisoner-page .bg-menu-theme {
    background: #ff4a17 !important;
    color: #ffffff !important;
  }

  body.prisoner-page .layout-menu.bg-menu-theme {
    background: #ff4a17 !important;
    background-color: #ff4a17 !important;
    color: #ffffff !important;
  }

  body.prisoner-page .layout-container {
    display: flex !important;
    width: 100% !important;
    min-height: 100vh;
  }

  body.prisoner-page .layout-page {
    display: flex !important;
    flex-direction: column !important;
    width: calc(100% - 16.25rem) !important;
    min-width: 0 !important;
    flex: 1 1 auto !important;
    padding: 0 !important;
    margin-left: 0 !important;
    background: transparent !important;
  }

  body.prisoner-page .content-wrapper {
    display: flex !important;
    align-items: stretch !important;
    flex: 1 1 auto !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    width: 100% !important;
    min-width: 0 !important;
  }

  body.prisoner-page .bg-menu-theme .menu-inner .menu-item {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  body.prisoner-page .menu-inner {
    width: 100% !important;
  }

  body.prisoner-page .menu-link {
    width: calc(100% - 2.3rem) !important;
    margin: 0.35rem 1.15rem !important;
    box-sizing: border-box;
  }

  body.prisoner-page .bg-menu-theme .menu-inner .menu-item .menu-link {
    display: inline-flex !important;
    align-items: center !important;
    gap: 10px !important;
    width: calc(100% - 2.3rem) !important;
    margin: 0.35rem 1.15rem !important;
    border: 1px solid rgba(255, 255, 255, 0.35) !important;
    border-radius: 999px !important;
    background: #ff4a17 !important;
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

  body.prisoner-page .bg-menu-theme .menu-inner .menu-item .menu-link .menu-icon {
    flex-shrink: 0 !important;
    margin: 0 !important;
    color: inherit !important;
  }

  body.prisoner-page .bg-menu-theme .menu-inner .menu-item .menu-link > div {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    flex-grow: 1 !important;
    text-align: left !important;
    margin: 0 !important;
  }

  body.prisoner-page .bg-menu-theme .menu-inner .menu-item.active > .menu-link {
    border-color: #ffffff !important;
    background-color: #ffffff !important;
    color: #ff4a17 !important;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.14), 0 6px 14px rgba(0, 0, 0, 0.16) !important;
  }

  body.prisoner-page .bg-menu-theme .menu-inner .menu-item.active > .menu-link .menu-icon {
    color: #ff4a17 !important;
  }

  body.prisoner-page .bg-menu-theme .menu-inner > .menu-item.active:before {
    display: none !important;
    content: none !important;
  }

  body.prisoner-page .bg-menu-theme .menu-inner .menu-item .menu-link:focus-visible,
  body.prisoner-page .layout-menu-toggle:focus-visible,
  body.prisoner-page .layout-overlay:focus-visible {
    outline: 2px solid #ff4a17 !important;
    outline-offset: 2px !important;
  }

  @media (hover: hover) and (pointer: fine) {
    body.prisoner-page .bg-menu-theme .menu-inner .menu-item:not(.active) .menu-link:hover {
      transform: translateY(-2px) !important;
      border-color: #ff4a17 !important;
      box-shadow: 0 4px 6px #ff4a17 !important;
    }
  }

  body.prisoner-page .layout-menu .menu-link[aria-disabled="true"] {
    background: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(255, 255, 255, 0.18) !important;
    color: rgba(255, 255, 255, 0.58) !important;
  }

  @media (hover: none) and (pointer: coarse) {
    body.prisoner-page .bg-menu-theme .menu-inner .menu-item .menu-link:active {
      transform: translateX(2px) scale(0.99) !important;
    }
  }

  @media (max-width: 1199.98px) {
    body.prisoner-page .layout-menu {
      position: fixed !important;
      width: 16.25rem !important;
      transform: translate3d(-100%, 0, 0);
    }

    body.prisoner-page .layout-menu-expanded .layout-menu {
      transform: translate3d(0, 0, 0);
    }

    body.prisoner-page .layout-page {
      width: 100% !important;
    }
  }

`;

export default function PrisonerRouteLayout({
  children,
}: PrisonerRouteLayoutProps) {
  return (
    <>
      <link
        href="/images/logos/favicon.jpg"
        rel="icon"
        type="image/jpeg"
      />
      {prisonerStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
      <style>{prisonerFontOverrides}</style>
      <PrisonerLayout>{children}</PrisonerLayout>
    </>
  );
}
