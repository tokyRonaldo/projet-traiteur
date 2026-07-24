// components/caterer/Header.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, CircleHelp, CircleUserRound, Inbox, FileText, CalendarCheck, UtensilsCrossed } from 'lucide-react';
import { api } from '@/lib/api';

// Pages où la recherche globale n'a pas de sens
const NO_SEARCH_PATHS = [
  '/caterer/profile',
  '/caterer/settings',
  '/caterer/subscription',
  '/caterer/notifications',
  '/caterer/calendar',
  '/caterer/gallery',
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

const TYPE_ICONS = {
  demande: Inbox,
  devis: FileText,
  reservation: CalendarCheck,
  service: UtensilsCrossed,
};

const TYPE_LABELS = {
  demande: 'Demande',
  devis: 'Devis',
  reservation: 'Réservation',
  service: 'Service',
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showSearch = !NO_SEARCH_PATHS.includes(pathname);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .get(`caterer/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          setResults(res.data ?? []);
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    router.push(result.url);
  };

  return (
    <header className="fixed top-0 right-0 left-72 z-40 flex justify-between items-center px-6 py-3 bg-[#fef8f1] border-b border-[#dfc0ba]">
      {showSearch ? (
        <div ref={wrapperRef} className="relative w-96">
          <div className="flex items-center bg-white border border-[#dfc0ba] rounded-full px-4 py-2 focus-within:border-[#9b2f1e] focus-within:ring-2 focus-within:ring-[#9b2f1e]/20 transition-all">
            <Search className="w-4 h-4 text-[#58423d] mr-2 shrink-0" strokeWidth={1.75} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="Rechercher un client, devis, service..."
              className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-[#58423d]/50 text-[#1d1b17]"
            />
          </div>

          {open && (
            <div className="absolute top-full mt-2 w-full bg-white border border-[#dfc0ba] rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto z-50">
              {loading && <p className="p-4 text-sm text-[#58423d]">Recherche...</p>}

              {!loading && results.length === 0 && query.trim().length >= 2 && (
                <p className="p-4 text-sm text-[#58423d]">Aucun résultat pour &quot;{query}&quot;.</p>
              )}

              {!loading &&
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
                        <p className="text-xs text-[#58423d]">
                          {TYPE_LABELS[result.type]} • {result.sublabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-[#1d1b17]">
          {PAGE_TITLES[pathname] ?? ''}
        </h2>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-[#58423d] hover:bg-[#ede7e0] p-2 rounded-full transition-all"
          aria-label="Aide"
        >
          <CircleHelp className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="text-[#9b2f1e] hover:bg-[#ede7e0] p-2 rounded-full transition-all"
          aria-label="Mon compte"
        >
          <CircleUserRound className="w-5 h-5" strokeWidth={2} fill="#ffedea" />
        </button>
      </div>
    </header>
  );
}