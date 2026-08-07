// hooks/useLogout.ts
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
export function useLogout(redirectTo: string = '/login') {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {logout}=useAuth();

  const requestLogout = () => setModalOpen(true);
  const cancelLogout = () => setModalOpen(false);

  const confirmLogout = async () => {
    setLoading(true);
    await logout();
    // pas besoin de reset loading : la page redirige de toute façon
  };

  return { modalOpen, loading, requestLogout, cancelLogout, confirmLogout };
}