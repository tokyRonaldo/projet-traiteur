'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAuthService } from './useAuthService';
import { useRouter, useSearchParams } from 'next/navigation';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLoginUser() {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {saveAuthentication} = useAuthService();
  const router = useRouter()
  const searchParams = useSearchParams();

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

      saveAuthentication(result.token, result.user,result.role);
      if(result.role == 'traiteur'){
        router.push('/caterer/dashboard');

      }
      else if(result.role == 'client'){
        const redirect = searchParams.get("redirect");
        if(redirect){
            router.push(redirect);
        }else{
            router.push("/client/dashboard");
        }
        router.push('/client/dashboard');
      }
      else{
        router.push('/admin/dashboard');
      }

      console.log(result.role);

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