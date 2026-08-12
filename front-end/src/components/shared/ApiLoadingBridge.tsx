// components/shared/ApiLoadingBridge.tsx
'use client';

import { useEffect } from 'react';
import { useLoading } from '@/context/LoadingContext';
import { LoadingEvents } from '@/lib/loadingEvents';

export default function ApiLoadingBridge() {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const unsubStart = LoadingEvents.onStart(startLoading);
    const unsubStop = LoadingEvents.onStop(stopLoading);
    return () => {
      unsubStart();
      unsubStop();
    };
  }, [startLoading, stopLoading]);

  return null;
}