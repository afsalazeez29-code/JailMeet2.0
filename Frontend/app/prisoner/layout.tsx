import { ReactNode } from 'react';

import PrisonerLayout from '../../components/legacy/prisoner/PrisonerLayout';

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

export default function PrisonerRouteLayout({
  children,
}: PrisonerRouteLayoutProps) {
  return (
    <>
      <link
        href="/legacy/logos/fvicon.jpg"
        rel="icon"
        type="image/jpeg"
      />
      {prisonerStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
      <PrisonerLayout>{children}</PrisonerLayout>
    </>
  );
}
