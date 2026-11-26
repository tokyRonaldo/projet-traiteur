// src/context/AuthContext.tsx
'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  name: string;
  email: string;
  roles?: { id: number; name: string }[];
  [key: string]: unknown; // autres champs renvoyés par ton API
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  fetchUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
  fetchUser: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.LARAVEL_API_URL;

  const fetchUser = useCallback(async (): Promise<User | null> => {
    const token = localStorage.getItem('token') ?? Cookies.get('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await fetch(`${API_URL}/api/user`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data: User = await res.json();
        setUser(data);
        return data;
      }

      localStorage.removeItem('token');
      Cookies.remove('token');
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    const token = localStorage.getItem('token') ?? Cookies.get('token');
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } finally {
      localStorage.removeItem('token');
      Cookies.remove('token');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);