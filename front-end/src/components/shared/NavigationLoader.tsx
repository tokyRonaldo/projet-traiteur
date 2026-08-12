// components/shared/NavigationLoader.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startLoading, stopLoading } = useLoading();
  const isNavigating = useRef(false);
  const previousUrl = useRef(`${pathname}?${searchParams.toString()}`);

  // Intercepte tous les clics sur des <a> internes pour démarrer le loader immédiatement
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || target.target === '_blank') {
        return;
      }

      // Évite de redéclencher si on clique sur le lien de la page actuelle
      if (href === pathname) return;

      isNavigating.current = true;
      startLoading();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname, startLoading]);

  // Arrête le loader une fois que la nouvelle route est effectivement montée
  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams.toString()}`;
    if (isNavigating.current && currentUrl !== previousUrl.current) {
      stopLoading();
      isNavigating.current = false;
    }
    previousUrl.current = currentUrl;
  }, [pathname, searchParams, stopLoading]);

  return null;
}