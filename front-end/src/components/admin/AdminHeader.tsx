// components/admin/AdminHeader.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, UserRound, Home, LogOut } from 'lucide-react';
import { getPageTitle } from './adminNav';

interface AdminHeaderProps {
  name: string;
  email: string;
  onMenuClick: () => void;
  onLogoutClick: () => void;
}

export default function AdminHeader({ name, email, onMenuClick, onLogoutClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors lg:hidden shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 truncate">{getPageTitle(pathname)}</h2>
        </div>

        <div ref={accountRef} className="relative shrink-0">
          <button
            onClick={() => setAccountOpen((o) => !o)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" strokeWidth={2} />
          </button>

          {accountOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
              <Link
                href="/admin/profile"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserRound className="w-4 h-4" strokeWidth={1.75} />
                Mon profil
              </Link>
              <Link
                href="/"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" strokeWidth={1.75} />
                Retour à l&apos;accueil
              </Link>
              <div className="border-t border-gray-100" />
              <button
                onClick={() => {
                  setAccountOpen(false);
                  onLogoutClick();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}