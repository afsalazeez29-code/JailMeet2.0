import { ReactNode } from 'react';

import VisitorLayout from '../../components/legacy/visitor/VisitorLayout';

type VisitorRouteLayoutProps = {
  children: ReactNode;
};

const visitorStylesheets = [
  '/legacy/visitor/visitorpage/assets/vendor/fonts/boxicons.css',
  '/legacy/visitor/visitorpage/assets/vendor/css/core.css',
  '/legacy/visitor/visitorpage/assets/vendor/css/theme-default.css',
  '/legacy/visitor/visitorpage/assets/css/demo.css',
  '/legacy/visitor/visitorpage/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
];

const visitorFontOverrides = `
  body.visitor-page {
    --jm-accent: #ff4a17;
    --jm-accent-rgb: 255, 74, 23;
    --jm-text: #000000;
    --bs-primary: #ff4a17;
    --bs-primary-rgb: 255, 74, 23;
    --bs-font-sans-serif: var(--font-body, "Montserrat", sans-serif);
    --bs-body-font-family: var(--font-body, "Montserrat", sans-serif);
    font-family: var(--font-body, "Montserrat", sans-serif);
  }

  body.visitor-page h1,
  body.visitor-page h2,
  body.visitor-page h3,
  body.visitor-page h4,
  body.visitor-page h5,
  body.visitor-page h6 {
    font-family: var(--font-heading, "Raleway", sans-serif);
    color: var(--jm-text);
  }

  body.visitor-page .card-title,
  body.visitor-page .fw-semibold {
    color: var(--jm-text);
  }

  body.visitor-page input,
  body.visitor-page select,
  body.visitor-page textarea,
  body.visitor-page button {
    font-family: var(--font-body, "Montserrat", sans-serif);
  }

  body.visitor-page .bg-menu-theme .menu-item.active > .menu-link,
  body.visitor-page .bg-menu-theme .menu-link:hover,
  body.visitor-page .bg-menu-theme .menu-link:focus {
    color: var(--jm-accent) !important;
    background-color: rgba(var(--jm-accent-rgb), 0.1) !important;
  }

  body.visitor-page .bg-menu-theme .menu-item.active > .menu-link .menu-icon,
  body.visitor-page .bg-menu-theme .menu-link:hover .menu-icon,
  body.visitor-page .bg-menu-theme .menu-link:focus .menu-icon {
    color: var(--jm-accent) !important;
  }

  body.visitor-page .layout-wrapper:not(.layout-horizontal) .bg-menu-theme .menu-inner > .menu-item.active:before {
    background: var(--jm-accent) !important;
  }

  body.visitor-page .bg-label-primary,
  body.visitor-page .text-primary,
  body.visitor-page .link-primary {
    color: var(--jm-accent) !important;
  }

  body.visitor-page .bg-label-primary {
    background-color: rgba(var(--jm-accent-rgb), 0.14) !important;
  }

  body.visitor-page .btn-primary {
    color: #ffffff !important;
    background-color: var(--jm-accent) !important;
    border-color: var(--jm-accent) !important;
    box-shadow: none !important;
  }

  body.visitor-page .btn-primary:hover,
  body.visitor-page .btn-primary:focus,
  body.visitor-page .btn-primary:active,
  body.visitor-page .btn-primary.active {
    color: #ffffff !important;
    background-color: #e64214 !important;
    border-color: #e64214 !important;
  }

  body.visitor-page .btn-outline-primary {
    color: var(--jm-accent) !important;
    border-color: var(--jm-accent) !important;
  }

  body.visitor-page .btn-outline-primary:hover,
  body.visitor-page .btn-outline-primary:focus,
  body.visitor-page .btn-outline-primary:active,
  body.visitor-page .btn-outline-primary.active {
    color: #ffffff !important;
    background-color: var(--jm-accent) !important;
    border-color: var(--jm-accent) !important;
  }

  body.visitor-page .form-control:focus,
  body.visitor-page .form-select:focus {
    border-color: var(--jm-accent) !important;
    box-shadow: 0 0 0 0.2rem rgba(var(--jm-accent-rgb), 0.18) !important;
  }

  body.visitor-page .form-check-input:checked {
    background-color: var(--jm-accent) !important;
    border-color: var(--jm-accent) !important;
  }

  body.visitor-page .dropdown-item.active,
  body.visitor-page .dropdown-item:active,
  body.visitor-page .page-item.active .page-link {
    color: #ffffff !important;
    background-color: var(--jm-accent) !important;
    border-color: var(--jm-accent) !important;
  }

  body.visitor-page .dropdown-item:hover,
  body.visitor-page .dropdown-item:focus {
    color: var(--jm-accent) !important;
    background-color: rgba(var(--jm-accent-rgb), 0.1) !important;
  }

  body.visitor-page .dropdown-item:hover i,
  body.visitor-page .dropdown-item:focus i {
    color: var(--jm-accent) !important;
  }

  body.visitor-page .nav-pills .nav-link.active,
  body.visitor-page .nav-pills .show > .nav-link {
    color: #ffffff !important;
    background-color: var(--jm-accent) !important;
    box-shadow: 0 2px 6px rgba(var(--jm-accent-rgb), 0.35) !important;
  }

  body.visitor-page .nav-pills .nav-link:hover,
  body.visitor-page .nav-pills .nav-link:focus {
    color: var(--jm-accent) !important;
  }

  body.visitor-page .alert-info {
    color: var(--jm-accent) !important;
    background-color: rgba(var(--jm-accent-rgb), 0.12) !important;
    border-color: rgba(var(--jm-accent-rgb), 0.2) !important;
  }

  body.visitor-page .page-link,
  body.visitor-page .page-link:hover,
  body.visitor-page .page-link:focus {
    color: var(--jm-accent) !important;
  }
`;

export default function VisitorRouteLayout({
  children,
}: VisitorRouteLayoutProps) {
  return (
    <>
      <link href="/legacy/logos/fvicon.jpg" rel="icon" />
      {visitorStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
      <style>{visitorFontOverrides}</style>
      <VisitorLayout>{children}</VisitorLayout>
    </>
  );
}
