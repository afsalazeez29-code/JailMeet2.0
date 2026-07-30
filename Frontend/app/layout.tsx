import type { Metadata } from 'next';
import { Montserrat, Raleway } from 'next/font/google';

import './globals.css';
import AuthProvider from '@features/auth/context/AuthProvider';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JailMeet',
  description: 'JailMeet landing page',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${raleway.variable}`}
    >
      <head>
        <link href="/images/logos/favicon.jpg" rel="icon" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
