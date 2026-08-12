// context/LoadingContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

interface LoadingContextValue {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const activeCount = useRef(0);

  const startLoading = useCallback(() => {
    activeCount.current += 1;
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    activeCount.current = Math.max(0, activeCount.current - 1);
    if (activeCount.current === 0) {
      setIsLoading(false);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading doit être utilisé dans un LoadingProvider');
  return ctx;
}