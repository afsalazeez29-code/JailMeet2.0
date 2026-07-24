import { ReactNode } from 'react';

import PrisonerLayout from '../../components/layouts/prisoner/PrisonerLayout';

type PrisonerRouteLayoutProps = {
  children: ReactNode;
};

const prisonerStylesheets = [
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
