import { useState, useEffect } from 'react';

type Platform = 'web' | 'pwa' | 'mobile';
type ScreenSize = 'mobile' | 'tablet' | 'desktop';

interface PlatformInfo {
  platform: Platform;
  screenSize: ScreenSize;
  isMobile: boolean;
  isPwa: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  supportsPush: boolean;
  hasServiceWorker: boolean;
}

export function usePlatform(): PlatformInfo {
  const [info, setInfo] = useState<PlatformInfo>(() => ({
    platform: detectPlatform(),
    screenSize: detectScreenSize(),
    isMobile: detectScreenSize() === 'mobile',
    isPwa: window.matchMedia('(display-mode: standalone)').matches,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    isOnline: navigator.onLine,
    supportsPush: 'Notification' in window && 'serviceWorker' in navigator,
    hasServiceWorker: 'serviceWorker' in navigator,
  }));

  useEffect(() => {
    const onResize = () => setInfo(prev => ({ ...prev, screenSize: detectScreenSize(), isMobile: detectScreenSize() === 'mobile' }));
    const onOnline = () => setInfo(prev => ({ ...prev, isOnline: true }));
    const onOffline = () => setInfo(prev => ({ ...prev, isOnline: false }));
    const onAppInstalled = () => setInfo(prev => ({ ...prev, isPwa: true, isStandalone: true }));

    window.addEventListener('resize', onResize);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  return info;
}

function detectScreenSize(): ScreenSize {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|iphone|ipad|ipod|blackberry|windows phone/g.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (isStandalone) return 'pwa';
  if (isMobileUA) return 'mobile';
  return 'web';
}
