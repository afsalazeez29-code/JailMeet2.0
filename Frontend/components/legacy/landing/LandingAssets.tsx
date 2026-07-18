'use client';

import { useEffect } from 'react';

const landingStylesheets = [
  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
  '/legacy/landing/assets/vendor/bootstrap/css/bootstrap.min.css',
  '/legacy/landing/assets/vendor/bootstrap-icons/bootstrap-icons.css',
  '/legacy/landing/assets/vendor/aos/aos.css',
  '/legacy/landing/assets/vendor/glightbox/css/glightbox.min.css',
  '/legacy/landing/assets/vendor/swiper/swiper-bundle.min.css',
  '/legacy/landing/assets/css/main.css',
];

export default function LandingAssets() {
  useEffect(() => {
    document.body.classList.add('index-page');

    return () => {
      document.body.classList.remove(
        'index-page',
        'mobile-nav-active',
        'scrolled',
      );
    };
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
      {landingStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
    </>
  );
}
