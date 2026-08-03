'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const BODY_SCROLL_LOCK_CLASS = 'dashboard-mobile-sidebar-open';
const DESKTOP_MEDIA_QUERY = '(min-width: 1200px)';

function clearStaleGlobalDrawerState() {
  document.body.classList.remove(
    BODY_SCROLL_LOCK_CLASS,
    'layout-menu-expanded',
    'layout-transitioning',
  );
  document.documentElement.classList.remove(
    'layout-menu-expanded',
    'layout-transitioning',
  );
}

export function useMobileSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    clearStaleGlobalDrawerState();
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      clearStaleGlobalDrawerState();
      return;
    }

    document.body.classList.add(BODY_SCROLL_LOCK_CLASS);

    return () => {
      clearStaleGlobalDrawerState();
    };
  }, [isOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        close();
      }
    };

    if (desktopMedia.matches) {
      close();
    }

    document.addEventListener('keydown', handleKeyDown);
    desktopMedia.addEventListener('change', handleViewportChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      desktopMedia.removeEventListener('change', handleViewportChange);
      clearStaleGlobalDrawerState();
    };
  }, [close]);

  return { close, isOpen, toggle };
}
