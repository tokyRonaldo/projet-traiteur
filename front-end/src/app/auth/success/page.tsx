'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const run = async () => {
      const token = params.get('token');
      if (token) {
        localStorage.setItem('token', token);
        Cookies.set('token', token, { expires: 7, sameSite: 'lax' });
        await fetchUser(); // récupère l'utilisateur AVANT de rediriger
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };
    run();
  }, []);

  return <p>Connexion en cours...</p>;
}