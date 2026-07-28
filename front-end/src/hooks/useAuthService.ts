import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useAuthService() {
  const { setUser } = useAuth();
  const router = useRouter();

  const saveAuthentication = (token: string, user: any,role : string) => {
    localStorage.setItem('token', token);

    Cookies.set('token', token, {
      expires: 7,
      sameSite: 'lax',
    });
    Cookies.set("role", role, {
    expires: 7,
    sameSite: "lax",
  });

    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  return {
    saveAuthentication,
    logout,
    getToken,
  };
}