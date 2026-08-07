// components/home/SearchBar.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, UtensilsCrossed } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (service.trim()) params.set('service', service.trim());
    if (location.trim()) params.set('location', location.trim());

    router.push(`/caterer${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-primary/10"
    >
      <div className="flex items-center flex-1 px-3 py-2">
        <Search className="w-5 h-5 opacity-50 shrink-0" strokeWidth={1.75} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom du traiteur..."
          className="w-full bg-transparent border-none outline-none px-2 text-sm"
        />
      </div>

      <div className="hidden sm:block w-px bg-primary/10 my-1" />

      <div className="flex items-center flex-1 px-3 py-2">
        <UtensilsCrossed className="w-5 h-5 opacity-50 shrink-0" strokeWidth={1.75} />
        <input
          type="text"
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="Type de service (buffet, cocktail...)"
          className="w-full bg-transparent border-none outline-none px-2 text-sm"
        />
      </div>

      <div className="hidden sm:block w-px bg-primary/10 my-1" />

      <div className="flex items-center flex-1 px-3 py-2">
        <MapPin className="w-5 h-5 opacity-50 shrink-0" strokeWidth={1.75} />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ville, région..."
          className="w-full bg-transparent border-none outline-none px-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shrink-0"
      >
        Rechercher
      </button>
    </form>
  );
}