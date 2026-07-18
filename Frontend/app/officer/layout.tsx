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

export default function OfficerRouteLayout({
  children,
}: OfficerRouteLayoutProps) {
  return (
    <>
      <link
        href="/legacy/logos/fvicon.jpg"
        rel="icon"
        type="image/jpeg"
      />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      {officerStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
      <OfficerLayout>{children}</OfficerLayout>
    </>
  );
}
