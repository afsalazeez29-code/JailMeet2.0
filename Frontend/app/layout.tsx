import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JailMeet',
  description: 'JailMeet landing page',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link href="/legacy/logos/fvicon.jpg" rel="icon" />
      </head>
      <body>{children}</body>
    </html>
  );
}
