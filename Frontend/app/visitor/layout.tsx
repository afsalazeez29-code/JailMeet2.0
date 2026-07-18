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

export default function VisitorRouteLayout({
  children,
}: VisitorRouteLayoutProps) {
  return (
    <>
      <link href="/legacy/logos/fvicon.jpg" rel="icon" />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      />
      {visitorStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
      <VisitorLayout>{children}</VisitorLayout>
    </>
  );
}
