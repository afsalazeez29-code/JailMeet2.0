import { ReactNode } from 'react';

import OfficerLayout from '../../components/legacy/officer/OfficerLayout';

type OfficerRouteLayoutProps = {
  children: ReactNode;
};

const officerStylesheets = [
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
