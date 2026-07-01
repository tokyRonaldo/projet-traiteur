// context/AuthContext.js
'use client';
import { createContext, useContext, useEffect, useState , useCallback} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  setUser: any;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser : null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
  fetchUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

 const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/user`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        Cookies.remove('token');
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUser();
  }, []);


  const logout = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem('token');
    Cookies.remove('token');
    setUser(null);
    router.push('/login');

  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isAuthenticated : !!user,logout ,fetchUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);