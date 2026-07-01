'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAuthService } from './useAuthService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLoginUser() {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {saveAuthentication} = useAuthService();

  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      saveAuthentication(result.token, result.user);

      return {
        success: true,
        message: result.message || 'Connexion réussie',
      };

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}