// components/client/search/Search.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

interface Category {
  id: number;
  name: string;
}

interface CatererResult {
  id: number;
  company_name: string;
  description: string;
  location: string;
  rating: number;
  average_price: number | null;
  logo_url: string | null;
  tags: string[];
  is_favorite: boolean;
}

interface PaginatedResponse {
  data: CatererResult[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function Search() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('client/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category_id', String(selectedCategory));
    if (location) params.set('location', location);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (minRating) params.set('min_rating', String(minRating));
    params.set('sort', sort);
    params.set('page', String(page));
    return params.toString();
  };

  const loadResults = () => {
    setLoading(true);
    api
      .get(`client/caterers/search?${buildQuery()}`)
      .then(setResults)
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResults();
  }, [selectedCategory, location, minPrice, maxPrice, minRating, sort, page]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(null);
    setPage(1);
  };

  const handleToggleFavorite = async (caterer: CatererResult) => {
    setResults((prev) =>
      prev
        ? {
            ...prev,
            data: prev.data.map((c) =>
              c.id === caterer.id ? { ...c, is_favorite: !c.is_favorite } : c
            ),
          }
        : prev
    );
    try {
      await api.post(`client/favorites/toggle/${caterer.id}`);
    } catch {
      loadResults();
    }
  };

  const ratingOptions = [3.5, 4.0, 4.5];

  return (
    <div className="flex gap-6">
      {/* Filtres */}
      <aside className="w-72 shrink-0">
        <div className="sticky top-24 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#1d1b17] mb-4">Filtres</h2>

            <div className="mb-4">
              <label className="text-sm font-bold text-[#1d1b17] block mb-2">Type de cuisine</label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat.id}
                      onChange={() => {
                        setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                        setPage(1);
                      }}
                      className="w-4 h-4 rounded border-[#dfc0ba] text-[#9b2f1e] focus:ring-[#9b2f1e]"
                    />
                    <span className="text-sm text-[#58423d] group-hover:text-[#9b2f1e]">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#dfc0ba] my-4" />

            <div className="mb-4">
              <label className="text-sm font-bold text-[#1d1b17] block mb-2">Localisation</label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="Ville, région..."
                className="w-full px-3 py-2 border border-[#dfc0ba] rounded-lg text-sm bg-white focus:ring-1 focus:ring-[#9b2f1e] outline-none"
              />
            </div>

            <div className="h-px bg-[#dfc0ba] my-4" />

            <div className="mb-4">
              <label className="text-sm font-bold text-[#1d1b17] block mb-2">Prix par personne (€)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Min"
                  className="px-3 py-2 border border-[#dfc0ba] rounded-lg text-sm bg-white focus:ring-1 focus:ring-[#9b2f1e] outline-none"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Max"
                  className="px-3 py-2 border border-[#dfc0ba] rounded-lg text-sm bg-white focus:ring-1 focus:ring-[#9b2f1e] outline-none"
                />
              </div>
            </div>

            <div className="h-px bg-[#dfc0ba] my-4" />

            <div>
              <label className="text-sm font-bold text-[#1d1b17] block mb-2">Note minimale</label>
              <div className="flex flex-wrap gap-2">
                {ratingOptions.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setMinRating(minRating === r ? null : r);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      minRating === r
                        ? 'border border-[#9b2f1e] bg-[#ffdad4] text-[#9b2f1e]'
                        : 'border border-[#dfc0ba] text-[#58423d] hover:border-[#9b2f1e]'
                    }`}
                  >
                    {r.toFixed(1)}+
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="w-full bg-[#f3ede6] py-3 rounded-xl text-sm font-bold text-[#58423d] hover:bg-[#ede7e0] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </aside>

      {/* Résultats */}
      <section className="flex-1">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#1d1b17]">Traiteurs disponibles</h2>
            <p className="text-[#58423d]">
              {results?.total ?? 0} professionnel(s) trouvé(s)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#58423d]">Trier par :</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-transparent border-none text-sm font-bold text-[#9b2f1e] focus:ring-0 cursor-pointer"
            >
              <option value="rating">Mieux notés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="newest">Plus récents</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-[#58423d]">Chargement...</p>}

        {!loading && results?.data.length === 0 && (
          <div className="bg-white border border-[#dfc0ba] rounded-xl p-10 text-center">
            <p className="text-[#58423d]">Aucun traiteur ne correspond à ces critères.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results?.data.map((caterer) => (
            <div
              key={caterer.id}
              className="group bg-white rounded-lg border border-[#dfc0ba] overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden bg-[#f3ede6] flex items-center justify-center">
                {caterer.logo_url ? (
                  <img
                    src={caterer.logo_url}
                    alt={caterer.company_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImageOff className="w-10 h-10 text-[#8b716c]" strokeWidth={1.5} />
                )}

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4 text-[#7a4b00]" fill="#7a4b00" strokeWidth={1.5} />
                  <span className="text-sm font-bold">{caterer.rating.toFixed(1)}</span>
                </div>

                <button
                  onClick={() => handleToggleFavorite(caterer)}
                  className={`absolute top-4 left-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    caterer.is_favorite
                      ? 'bg-white text-[#9b2f1e]'
                      : 'bg-white/20 text-white hover:bg-white hover:text-[#9b2f1e]'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={caterer.is_favorite ? '#9b2f1e' : 'none'} strokeWidth={1.75} />
                </button>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold">{caterer.company_name}</h3>
                  {caterer.average_price && (
                    <p className="text-sm font-bold text-[#9b2f1e] shrink-0">
                      ~{caterer.average_price} €/pers.
                    </p>
                  )}
                </div>
                <p className="text-xs text-[#58423d] mb-2">{caterer.location}</p>
                <p className="text-sm text-[#58423d] mb-3 line-clamp-2">{caterer.description}</p>

                {caterer.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {caterer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded bg-[#f3ede6] text-[#9b2f1e] text-[10px] font-bold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/client/caterers/${caterer.id}`}
                  className="block w-full text-center border border-[#9b2f1e] text-[#9b2f1e] py-2.5 rounded-lg text-sm font-bold hover:bg-[#ffdad4]/30 transition-colors"
                >
                  Voir le profil &amp; le menu
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {results && results.last_page > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full border border-[#dfc0ba] flex items-center justify-center hover:bg-[#9b2f1e] hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: results.last_page }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    page === p ? 'bg-[#9b2f1e] text-white' : 'text-[#58423d] hover:bg-[#f3ede6]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(results.last_page, p + 1))}
              disabled={page === results.last_page}
              className="w-10 h-10 rounded-full border border-[#dfc0ba] flex items-center justify-center hover:bg-[#9b2f1e] hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}