'use client';

import { useState } from 'react';
import { RegisterCatererData } from '@/types';
import { useAuthService } from './useAuthService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useRegisterCaterer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {saveAuthentication} = useAuthService();


  const register = async (formData: RegisterCatererData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        location: formData.location.trim(),
        address: formData.address.trim(), //
        description: formData.description?.trim() || '',
        website: formData.website?.trim() || '',
        contact: formData.contact?.trim() || '',
      };

      const response = await fetch(`${API_URL}/api/register/caterer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(data.message || 'Cet email est déjà utilisé');
        }

        if (response.status === 422) {
          throw new Error(data.message || 'Les données envoyées sont invalides.');
        }

        throw new Error(data.message || "Échec de l'inscription");
      }

      saveAuthentication(data.token, data.user,data.role);


      return {
        success: true,
        message: data.message || 'Inscription réussie !',
      };

    } catch (err: any) {
      const message = err.message || 'Une erreur est survenue.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
}