// components/client/favorites/Favorites.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ImageOff } from 'lucide-react';
import { api } from '@/lib/api';

interface FavoriteCaterer {
  id: number;
  company_name: string;
  location: string;
  rating: number;
  logo_url: string | null;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteCaterer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = () => {
    setLoading(true);
    api
      .get('client/favorites')
      .then((res) => setFavorites(res.data ?? res))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (catererId: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== catererId));
    try {
      await api.post(`client/favorites/toggle/${catererId}`);
    } catch {
      loadFavorites();
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17]">Mes favoris</h2>
        <p className="text-[#58423d]">Retrouvez rapidement les traiteurs que vous avez aimés.</p>
      </header>

      {loading && <p className="text-[#58423d]">Chargement...</p>}

      {!loading && favorites.length === 0 && (
        <div className="bg-white border border-[#dfc0ba] rounded-xl p-10 text-center">
          <Heart className="w-10 h-10 text-[#8b716c] mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-[#58423d] mb-1">Vous n'avez aucun traiteur en favori.</p>
          <Link href="/client/search" className="text-[#9b2f1e] font-semibold hover:underline">
            Rechercher des traiteurs
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {favorites.map((caterer) => (
          <div key={caterer.id} className="bg-white border border-[#dfc0ba] rounded-xl overflow-hidden group">
            <div className="h-32 bg-[#f3ede6] flex items-center justify-center relative">
              {caterer.logo_url ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.logo_url}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="w-8 h-8 text-[#8b716c]" strokeWidth={1.5} />
              )}
              <button
                onClick={() => handleRemove(caterer.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full text-[#9b2f1e] hover:bg-[#ffdad4] transition-colors"
                title="Retirer des favoris"
              >
                <Heart className="w-4 h-4" fill="#9b2f1e" strokeWidth={1.75} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{caterer.company_name}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 text-[#7a4b00]" fill="#7a4b00" strokeWidth={1.5} />
                  <span className="text-sm font-semibold">{caterer.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-sm text-[#58423d] mb-3">{caterer.location}</p>
              <Link
                href={`/client/caterers/${caterer.id}`}
                className="block text-center border border-[#9b2f1e] text-[#9b2f1e] py-2 rounded-lg text-sm font-semibold hover:bg-[#ffdad4]/30 transition-colors"
              >
                Voir le profil
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}