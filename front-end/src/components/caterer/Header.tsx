// components/caterer/Header.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, Bell, ChevronDown, UserRound, Settings, LogOut,
  Inbox, FileText, CalendarCheck, UtensilsCrossed,
} from 'lucide-react';
import { api } from '@/lib/api';

const NO_SEARCH_PATHS = [
  '/caterer/profile', '/caterer/settings', '/caterer/subscription',
  '/caterer/notifications', '/caterer/calendar', '/caterer/gallery',
];

const PAGE_TITLES: Record<string, string> = {
  '/caterer/profile': 'Profil',
  '/caterer/settings': 'Paramètres',
  '/caterer/subscription': 'Abonnement',
  '/caterer/notifications': 'Notifications',
  '/caterer/calendar': 'Disponibilité',
  '/caterer/gallery': 'Galerie',
};

interface SearchResult {
  type: 'demande' | 'devis' | 'reservation' | 'service';
  label: string;
  sublabel: string;
  url: string;
  id: number;
}

const TYPE_ICONS = { demande: Inbox, devis: FileText, reservation: CalendarCheck, service: UtensilsCrossed };
const TYPE_LABELS = { demande: 'Demande', devis: 'Devis', reservation: 'Réservation', service: 'Service' };

interface CatererInfo {
  company_name: string;
  logo_url: string | null;
}

interface HeaderProps {
  caterer: CatererInfo | null;
  onLogoutClick: () => void;
}

export default function Header({ caterer, onLogoutClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const showSearch = !NO_SEARCH_PATHS.includes(pathname);

  useEffect(() => {
    api.get('caterer/notifications/unread-count').then((res) => setUnreadCount(res.count ?? 0)).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      setSearchLoading(true);
      api
        .get(`caterer/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          setResults(res.data ?? []);
          setSearchOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setSearchLoading(false));
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setSearchOpen(false);
    setQuery('');
    router.push(result.url);
  };

  const initials = caterer?.company_name
    ? caterer.company_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '..';

  return (
    <header className="fixed top-0 right-0 left-72 z-40 flex justify-between items-center px-6 py-3 bg-[#fef8f1] border-b border-[#dfc0ba]">
      {showSearch ? (
        <div ref={searchRef} className="relative w-96">
          <div className="flex items-center bg-white border border-[#dfc0ba] rounded-full px-4 py-2 focus-within:border-[#9b2f1e] focus-within:ring-2 focus-within:ring-[#9b2f1e]/20 transition-all">
            <Search className="w-4 h-4 text-[#58423d] mr-2 shrink-0" strokeWidth={1.75} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setSearchOpen(true)}
              placeholder="Rechercher un client, devis, service..."
              className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-[#58423d]/50 text-[#1d1b17]"
            />
          </div>

          {searchOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border border-[#dfc0ba] rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto z-50">
              {searchLoading && <p className="p-4 text-sm text-[#58423d]">Recherche...</p>}
              {!searchLoading && results.length === 0 && query.trim().length >= 2 && (
                <p className="p-4 text-sm text-[#58423d]">Aucun résultat pour &quot;{query}&quot;.</p>
              )}
              {!searchLoading &&
                results.map((result, idx) => {
                  const Icon = TYPE_ICONS[result.type];
                  return (
                    <button
                      key={`${result.type}-${result.id}-${idx}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f9f3ec] transition-colors text-left border-b border-[#dfc0ba]/50 last:border-0"
                    >
                      <span className="p-2 bg-[#ffdad4] text-[#9b2f1e] rounded-lg shrink-0">
                        <Icon className="w-4 h-4" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1d1b17] truncate">{result.label}</p>
                        <p className="text-xs text-[#58423d]">{TYPE_LABELS[result.type]} • {result.sublabel}</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-[#1d1b17]">{PAGE_TITLES[pathname] ?? ''}</h2>
      )}

      <div className="flex items-center gap-2">
        {/* Cloche notifications */}
        <Link
          href="/caterer/notifications"
          className="relative text-[#58423d] hover:bg-[#ede7e0] p-2 rounded-full transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#9b2f1e] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Menu compte */}
        <div ref={accountRef} className="relative">
          <button
            onClick={() => setAccountOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-[#ede7e0] rounded-full transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#ffdad4] flex items-center justify-center overflow-hidden shrink-0">
              {caterer?.logo_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.logo_url}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#9b2f1e] font-bold text-xs">{initials}</span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#58423d]" strokeWidth={2} />
          </button>

          {accountOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#dfc0ba] rounded-xl shadow-lg overflow-hidden z-50">
              <Link
                href="/caterer/profile"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#1d1b17] hover:bg-[#f9f3ec] transition-colors"
              >
                <UserRound className="w-4 h-4" strokeWidth={1.75} />
                Mon profil
              </Link>
              <Link
                href="/caterer/settings"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#1d1b17] hover:bg-[#f9f3ec] transition-colors"
              >
                <Settings className="w-4 h-4" strokeWidth={1.75} />
                Paramètres
              </Link>
              <div className="border-t border-[#dfc0ba]" />
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