// components/shared/GlobalLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '@/context/LoadingContext';

export default function GlobalLoader() {
  const { isLoading } = useLoading();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let hideTimeout: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setVisible(true);
      setProgress(10);

      // Progression simulée qui ralentit en approchant 90%
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + (90 - prev) * 0.1 : prev));
      }, 200);
    } else {
      clearInterval(interval);
      setProgress(100);
      hideTimeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimeout);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-[#9b2f1e] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(155,47,30,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}