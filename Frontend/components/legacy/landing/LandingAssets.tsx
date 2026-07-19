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

const landingScripts = [
  '/legacy/landing/assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
  '/legacy/landing/assets/vendor/aos/aos.js',
  '/legacy/landing/assets/vendor/purecounter/purecounter_vanilla.js',
  '/legacy/landing/assets/vendor/glightbox/js/glightbox.min.js',
  '/legacy/landing/assets/vendor/swiper/swiper-bundle.min.js',
  '/legacy/landing/assets/js/main.js',
];

type LandingWindow = Window &
  typeof globalThis & {
    AOS?: {
      init: (options: { duration: number; once: boolean }) => void;
      refreshHard?: () => void;
    };
    __jailMeetLandingAosInitialized?: boolean;
  };

function loadLandingScript(src: string) {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[data-landing-script="${src}"]`,
  );

  if (existingScript) {
    return existingScript.dataset.loaded === 'true'
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          existingScript.addEventListener('load', () => resolve(), {
            once: true,
          });
          existingScript.addEventListener(
            'error',
            () => reject(new Error(`Failed to load ${src}`)),
            { once: true },
          );
        });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.landingScript = src;
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      'error',
      () => reject(new Error(`Failed to load ${src}`)),
      { once: true },
    );
    document.body.appendChild(script);
  });
}

export default function LandingAssets() {
  useEffect(() => {
    document.body.classList.add('index-page');

    let isMounted = true;

    const loadScripts = async () => {
      for (const script of landingScripts) {
        await loadLandingScript(script);
      }

      const landingWindow = window as LandingWindow;

      if (
        isMounted &&
        landingWindow.AOS &&
        !landingWindow.__jailMeetLandingAosInitialized
      ) {
        landingWindow.AOS.init({
          duration: 600,
          once: true,
        });
        landingWindow.AOS.refreshHard?.();
        landingWindow.__jailMeetLandingAosInitialized = true;
      }
    };

    void loadScripts();

    return () => {
      isMounted = false;
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
