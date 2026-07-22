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
  }

  body.visitor-page input,
  body.visitor-page select,
  body.visitor-page textarea,
  body.visitor-page button {
    font-family: var(--font-body, "Montserrat", sans-serif);
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
