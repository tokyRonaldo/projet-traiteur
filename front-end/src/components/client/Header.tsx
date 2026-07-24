// components/client/Header.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, LifeBuoy, Plus } from 'lucide-react';
import { api } from '@/lib/api';

interface SearchResult {
  id: number;
  company_name: string;
  location: string;
  logo_url: string | null;
}

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Compte des notifications/messages non lus
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
          setOpen(true);
        })
        .catch(() => setResults([]));
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <header className="h-16 fixed top-0 right-0 left-64 z-40 bg-[#fef8f1] border-b border-[#dfc0ba] flex justify-between items-center px-8">
      <div ref={wrapperRef} className="relative w-96">
        <div className="flex items-center bg-white border border-[#dfc0ba] rounded-full px-4 py-2 focus-within:border-[#9b2f1e] focus-within:ring-2 focus-within:ring-[#9b2f1e]/20 transition-all">
          <Search className="w-4 h-4 text-[#58423d] mr-2 shrink-0" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Rechercher un traiteur, une ville..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#58423d]/50"
          />
        </div>

        {open && (
          <div className="absolute top-full mt-2 w-full bg-white border border-[#dfc0ba] rounded-xl shadow-lg overflow-hidden max-h-80 overflow-y-auto z-50">
            {results.length === 0 ? (
              <p className="p-4 text-sm text-[#58423d]">Aucun traiteur trouvé pour &quot;{query}&quot;.</p>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    router.push(`/client/caterers/${r.id}`);
                    setOpen(false);
                    setQuery('');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f9f3ec] transition-colors text-left border-b border-[#dfc0ba]/50 last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-[#ffdad4] flex items-center justify-center shrink-0 overflow-hidden">
                    {r.logo_url ? (
                      <img src={r.logo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-[#9b2f1e]">
                        {r.company_name.slice(0, 2).toUpperCase()}
                      </span>
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

      <div className="flex items-center gap-6">
        <button className="relative text-[#58423d] hover:text-[#9b2f1e] transition-colors">
          <Bell className="w-5 h-5" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#9b2f1e] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button className="text-sm font-semibold text-[#58423d] hover:text-[#9b2f1e] transition-colors flex items-center gap-1">
          <LifeBuoy className="w-4 h-4" strokeWidth={1.75} />
          Assistance
        </button>
        <button
          onClick={() => router.push('/client/requests/new')}
          className="bg-[#9b2f1e] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} />
          Nouvelle demande
        </button>
      </div>
    </header>
  );
}