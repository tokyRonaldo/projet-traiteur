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
        const result = await fetchUser(); // récupère l'utilisateur AVANT de rediriger
        const role = result?.roles?.[0]?.name;
        if(role == 'traiteur'){
          router.push('/caterer/dashboard');

        }
        else if(role == 'client'){
          router.push('/client/dashboard');
        }
        else{
          router.push('/admin/dashboard');
        }

      } else {
        router.push('/login');
      }
    };
    run();
  }, []);

  return <p>Connexion en cours...</p>;
}