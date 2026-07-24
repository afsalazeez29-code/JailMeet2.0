'use client';

import { useEffect } from 'react';

const landingStylesheets = [
  '/legacy/landing/assets/vendor/bootstrap/css/bootstrap.min.css',
  '/legacy/landing/assets/vendor/bootstrap-icons/bootstrap-icons.css',
  '/legacy/landing/assets/vendor/aos/aos.css',
  '/legacy/landing/assets/vendor/glightbox/css/glightbox.min.css',
  '/legacy/landing/assets/vendor/swiper/swiper-bundle.min.css',
  '/styles/landing/main.css',
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
      {landingStylesheets.map((href) => (
        <link href={href} key={href} rel="stylesheet" />
      ))}
    </>
  );
}
