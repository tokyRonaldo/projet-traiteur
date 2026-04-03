'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RegisterCatererData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useRegisterCaterer() {
  const { refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (formData: RegisterCatererData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        location: formData.location.trim(),
        adresse: formData.adresse.trim(),
        description: formData.description?.trim() || '',
      };

      const getCookie = (name: string) => {
        if (typeof document === 'undefined') return null; // Sécurité pour le SSR
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        return null;
      };

      const response = await fetch(`${API_URL}/api/register/caterer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '', 
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Gestion spécifique de l'erreur 419 si elle survient encore
        if (response.status === 419) {
           throw new Error("La session de sécurité a expiré, veuillez réessayer.");
        }
        if (response.status === 409) {
          throw new Error(data.message || 'Email déjà utilisé');
        }
        throw new Error(data.message || 'Échec de l’inscription');
      }

      await refetchUser();

      return { 
        success: true, 
        message: data.message || 'Inscription réussie !' 
      };

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}