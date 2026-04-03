'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLogout() {
  const { refetchUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Utilitaire XSRF pour Sanctum (si vous utilisez le driver 'cookie')
      const getCookie = (name: string) => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
        return null;
      };

      const response = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
        },
        credentials: 'include', // Nécessaire pour que Laravel identifie l'utilisateur via session/cookie
      });

      if (!response.ok) {
        // Si le serveur dit que nous ne sommes pas autorisés (401), 
        // on considère que la session est déjà détruite.
        if (response.status !== 401) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || 'Erreur lors de la déconnexion');
        }
      }
      await refetchUser();

      router.push('/');
      router.refresh(); 

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
}