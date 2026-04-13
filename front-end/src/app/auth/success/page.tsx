'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleSuccess() {
  const router = useRouter();

  async function fetchUser(token : String){
        // récupérer user
        //changer l'url pour utiliser variable dans .env
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération de l’utilisateur');
        const user = await res.json();
        return user;

  }

  useEffect(() => {
    // récupérer token depuis URL
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    const token = params.get('token');

    if (token) {
      (async () => {
        try {
          // stocker token
          //localStorage.setItem('token', token);

          // récupérer user
          const userData = await fetchUser(token);

          // stocker user
          //localStorage.setItem('user', JSON.stringify(userData));

          console.log('User:', userData);

          // redirection vers dashboard
          //router.push('/dashboard');
        } catch (err) {
          console.error(err);
        }  
        })();  
    }
  }, []);

  return <p>Connexion Google en cours...</p>;
}