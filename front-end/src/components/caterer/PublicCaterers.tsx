// components/caterers/PublicCaterers.tsx
'use client';


import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
}

interface PaginatedResponse {
  data: CatererResult[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function PublicCaterers() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialise à partir des paramètres d'URL (venant du Hero)
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [location, setLocation] = useState(searchParams.get('location') ?? '');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);
  const [service, setService] = useState(searchParams.get('service') ?? '');
  
  useEffect(() => {
    api.get('public/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (service) params.set('service', service);
    if (selectedCategory) params.set('category_id', String(selectedCategory));
    if (location) params.set('location', location);
    if (minRating) params.set('min_rating', String(minRating));
    params.set('sort', sort);
    params.set('page', String(page));
    return params.toString();
  };

useEffect(() => {
  setLoading(true);
  api
    .get(`public/caterers?${buildQuery()}`)
    .then(setResults)
    .catch(() => setResults(null))
    .finally(() => setLoading(false));
}, [search, service, selectedCategory, location, minRating, sort, page]);

  const ratingOptions = [3.5, 4.0, 4.5];

  // Lien de profil : public si non connecté, espace client sinon
  const getProfileHref = (id: number) =>
    isAuthenticated ? `/client/caterers/${id}` : `/caterer/${id}`;

  const getRequestHref = (id: number) =>
    isAuthenticated ? `/client/requests/new?caterer_id=${id}` : `/login?redirect=/client/requests/new?caterer_id=${id}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2">Nos traiteurs partenaires</h1>
        <p className="opacity-60">{results?.total ?? 0} professionnels vérifiés prêts pour votre événement</p>
      </div>

      <div className="flex gap-8">
        {/* Filtres */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div>
              <label className="text-sm font-bold block mb-2">Recherche</label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Nom, ville..."
                className="w-full px-3 py-2 border border-primary/20 rounded-lg text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="h-px bg-primary/10" />

            <div>
              <label className="text-sm font-bold block mb-2">Type de cuisine</label>
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
                      className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary"
                    />
                    <span className="text-sm opacity-70 group-hover:text-primary">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-primary/10" />

            <div>
              <label className="text-sm font-bold block mb-2">Localisation</label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="Ville, région..."
                className="w-full px-3 py-2 border border-primary/20 rounded-lg text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="h-px bg-primary/10" />

            <div>
              <label className="text-sm font-bold block mb-2">Type de service</label>
              <input
                type="text"
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                  setPage(1);
                }}
                placeholder="Buffet, cocktail, pâtisserie..."
                className="w-full px-3 py-2 border border-primary/20 rounded-lg text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="h-px bg-primary/10" />

            <div>
              <label className="text-sm font-bold block mb-2">Note minimale</label>
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
                        ? 'border border-primary bg-primary/10 text-primary'
                        : 'border border-primary/20 opacity-70 hover:border-primary'
                    }`}
                  >
                    {r.toFixed(1)}+
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Résultats */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm opacity-60">
              {results?.total ?? 0} résultat{(results?.total ?? 0) > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-60">Trier par :</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer"
              >
                <option value="rating">Mieux notés</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>
          </div>

          {loading && <p className="opacity-60">Chargement...</p>}

          {!loading && results?.data.length === 0 && (
            <div className="bg-white dark:bg-slate-800 border border-primary/10 rounded-xl p-10 text-center">
              <p className="opacity-60">Aucun traiteur ne correspond à ces critères.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results?.data.map((caterer) => (
              <div
                key={caterer.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-primary/10 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden bg-primary/5 flex items-center justify-center">
                  {caterer.logo_url ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.logo_url}`}
                      alt={caterer.company_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageOff className="w-10 h-10 opacity-30" strokeWidth={1.5} />
                  )}

                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-secondary" fill="currentColor" strokeWidth={1.5} />
                    <span className="text-sm font-bold">{caterer.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold">{caterer.company_name}</h3>
                    {caterer.average_price && (
                      <p className="text-sm font-bold text-primary shrink-0">
                        ~{caterer.average_price} €/pers.
                      </p>
                    )}
                  </div>
                  <p className="text-xs opacity-60 mb-2">{caterer.location}</p>
                  <p className="text-sm opacity-70 mb-3 line-clamp-2">{caterer.description}</p>

                  {caterer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {caterer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={getProfileHref(caterer.id)}
                      className="flex-1 text-center border border-primary text-primary py-2.5 rounded-lg text-sm font-bold hover:bg-primary/5 transition-colors"
                    >
                      Voir le profil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results && results.last_page > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: results.last_page }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-full font-bold transition-all ${
                      page === p ? 'bg-primary text-white' : 'opacity-70 hover:bg-primary/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(results.last_page, p + 1))}
                disabled={page === results.last_page}
                className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-10 bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Envie de contacter un traiteur ?</h3>
              <p className="opacity-70 mb-4">
                Créez un compte gratuitement pour envoyer des demandes de devis et suivre vos réservations.
              </p>
              <Link
                href="/register/user"
                className="inline-block bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Créer mon compte
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}