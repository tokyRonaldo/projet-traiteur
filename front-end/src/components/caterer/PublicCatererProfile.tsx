// components/caterers/PublicCatererProfile.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Globe, ImageOff, Lock } from 'lucide-react';
import { api } from '@/lib/api';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: { name: string } | null;
  thumbnail_url?: string | null;
}

interface ReviewItem {
  id: number;
  rating: number;
  comment: string | null;
  user: { name: string };
}

interface CatererDetail {
  id: number;
  company_name: string;
  description: string;
  location: string;
  website: string | null;
  rating: number;
  reviews_count: number;
  logo_url: string | null;
  gallery: { id: number; url: string; type: string }[];
  services: Service[];
  reviews: ReviewItem[];
}

export default function PublicCatererProfile({ catererId }: { catererId: string }) {
  const [caterer, setCaterer] = useState<CatererDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`public/caterers/${catererId}`)
      .then(setCaterer)
      .catch(() => setCaterer(null))
      .finally(() => setLoading(false));
  }, [catererId]);

  if (loading) return <p className="opacity-60 max-w-5xl mx-auto px-6 py-16">Chargement...</p>;
  if (!caterer) return <p className="opacity-60 max-w-5xl mx-auto px-6 py-16">Traiteur introuvable.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-slate-800 border border-primary/10 rounded-2xl overflow-hidden mb-6">
        <div className="h-48 bg-primary/5 flex items-center justify-center">
          {caterer.gallery[0] ? (

            caterer.gallery[0].type == 'image' ?(
              <img src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.gallery[0].url}`} alt=""  className="w-full h-full object-cover" />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.gallery[0].url}`}
                  className="w-full h-full object-cover pointer-events-none"
                  preload="metadata"
                  muted
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          ) : (
            <ImageOff className="w-10 h-10 text-[#8b716c]" strokeWidth={1.5} />
          )}


        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 -mt-16 mb-4">
            <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0 bg-primary/5">
              {caterer.logo_url ? (
                <img 
                src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.logo_url}`}
                alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {caterer.company_name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 pt-16">
              <h1 className="text-2xl font-bold">{caterer.company_name}</h1>
              <p className="text-sm opacity-60 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" strokeWidth={1.75} /> {caterer.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-secondary" fill="currentColor" strokeWidth={1.5} />
              <span className="font-bold">{caterer.rating.toFixed(1)}</span>
              <span className="text-sm opacity-60">({caterer.reviews_count} avis)</span>
            </div>
            {caterer.website && (
              <a href={caterer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                <Globe className="w-4 h-4" strokeWidth={1.75} /> Site web
              </a>
            )}
          </div>

          <p className="opacity-70 mb-6">{caterer.description}</p>

          {/* CTA connexion pour demander un devis */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary shrink-0" strokeWidth={1.75} />
              <p className="text-sm opacity-80">
                Connectez-vous pour demander un devis ou ajouter ce traiteur à vos favoris.
              </p>
            </div>
            <Link
              href={`/login?redirect=/client/caterers/${caterer.id}`}
              className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {caterer.gallery.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Galerie</h2>
          <div className="grid grid-cols-4 gap-3">
            {caterer.gallery.slice(0, 8).map((item) => (
              <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-primary/5">
                {item.type === 'image' ? (
                  <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.url}`}
                  alt="" className="w-full h-full object-cover" />
                ) : (
                  <video 
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.url}`}
                  className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3">Services proposés</h2>
        {caterer.services.length === 0 ? (
          <p className="opacity-60">Aucun service actif pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {caterer.services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-slate-800 border border-primary/10 rounded-xl overflow-hidden">
                <div className="h-32 bg-primary/5 flex items-center justify-center">
                  {service.thumbnail_url ? (
                    <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${service.thumbnail_url}`}
                    alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff className="w-6 h-6 opacity-30" strokeWidth={1.5} />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold">{service.title}</h3>
                    <span className="font-bold text-primary shrink-0">{Number(service.price)} €</span>
                  </div>
                  <p className="text-sm opacity-70 line-clamp-2">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Avis clients</h2>
        {caterer.reviews.length === 0 ? (
          <p className="opacity-60">Aucun avis pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {caterer.reviews.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-800 border border-primary/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-sm">{r.user.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-secondary' : 'opacity-20'}`} fill="currentColor" strokeWidth={1.5} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm opacity-70">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}