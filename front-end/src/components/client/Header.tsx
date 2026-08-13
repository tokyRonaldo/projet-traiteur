// components/client/Header.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, LifeBuoy, Plus, Menu } from 'lucide-react';
import { api } from '@/lib/api';
import { useMobileSidebar } from '@/context/MobileSidebarContext';

interface SearchResult {
  id: number;
  company_name: string;
  location: string;
  logo_url: string | null;
}

export default function Header() {
  const router = useRouter();
  const { open } = useMobileSidebar();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    api.get('client/notifications/unread-count').then((res) => setUnreadCount(res.count ?? 0)).catch(() => {});
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      api
        .get(`client/caterers/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          setResults(res.data ?? []);
          setSearchOpen(true);
        })
        .catch(() => setResults([]));
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleResultClick = (id: number) => {
    router.push(`/client/caterers/${id}`);
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setQuery('');
  };

  const searchInput = (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center bg-white border border-[#dfc0ba] rounded-full px-4 py-2 focus-within:border-[#9b2f1e] focus-within:ring-2 focus-within:ring-[#9b2f1e]/20 transition-all">
        <Search className="w-4 h-4 text-[#58423d] mr-2 shrink-0" strokeWidth={1.75} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setSearchOpen(true)}
          placeholder="Rechercher un traiteur, une ville..."
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#58423d]/50"
        />
      </div>

      {searchOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-[#dfc0ba] rounded-xl shadow-lg overflow-hidden max-h-80 overflow-y-auto z-50">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-[#58423d]">Aucun traiteur trouvé pour &quot;{query}&quot;.</p>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleResultClick(r.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f9f3ec] transition-colors text-left border-b border-[#dfc0ba]/50 last:border-0"
              >
                <div className="w-9 h-9 rounded-full bg-[#ffdad4] flex items-center justify-center shrink-0 overflow-hidden">
                  {r.logo_url ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${r.logo_url}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-[#9b2f1e]">{r.company_name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{r.company_name}</p>
                  <p className="text-xs text-[#58423d] truncate">{r.location}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-[#fef8f1] border-b border-[#dfc0ba]">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-2">
        <button
          onClick={open}
          className="p-2 text-[#58423d] hover:bg-[#f3ede6] rounded-full transition-all lg:hidden shrink-0"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.75} />
        </button>

        <div className="hidden md:block w-96 shrink-0">{searchInput}</div>

        <div className="flex items-center gap-2 md:gap-6 ml-auto">
          <button
            onClick={() => setMobileSearchOpen((o) => !o)}
            className="p-2 text-[#58423d] hover:bg-[#f3ede6] rounded-full transition-all md:hidden"
            aria-label="Rechercher"
          >
            <Search className="w-5 h-5" strokeWidth={1.75} />
          </button>

          <Link
            href="/client/notifications"
            className="relative text-[#58423d] hover:text-[#9b2f1e] transition-colors"
          >
            <Bell className="w-5 h-5" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#9b2f1e] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <button className="hidden lg:flex text-sm font-semibold text-[#58423d] hover:text-[#9b2f1e] transition-colors items-center gap-1">
            <LifeBuoy className="w-4 h-4" strokeWidth={1.75} />
            Assistance
          </button>

          <button
            onClick={() => router.push('/client/requests/new')}
            className="bg-[#9b2f1e] text-white px-3 md:px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Nouvelle demande</span>
          </button>
        </div>
      </div>

      {mobileSearchOpen && <div className="md:hidden px-4 pb-3">{searchInput}</div>}
    </header>
  );
}