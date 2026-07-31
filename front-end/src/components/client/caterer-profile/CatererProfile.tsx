// components/client/caterer-profile/CatererProfile.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Globe,
  Phone,
  Heart,
  ImageOff,
  MessageSquare,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  event_type: string;
  category: { name: string } | null;
  thumbnail_url?: string | null;
  thumbnail_type?: string | null;
}

interface ReviewItem {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user: { name: string };
}

interface CatererDetail {
  id: number;
  company_name: string;
  description: string;
  location: string;
  address: string;
  website: string | null;
  contact: string | null;
  rating: number;
  reviews_count: number;
  logo_url: string | null;
  gallery: { id: number; url: string; type: string }[];
  services: Service[];
  reviews: ReviewItem[];
  is_favorite: boolean;
}

export default function CatererProfile({ catererId }: { catererId: string }) {
  const router = useRouter();
  const [caterer, setCaterer] = useState<CatererDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    api
      .get(`client/caterers/${catererId}/profile`)
      .then(setCaterer)
      .catch(() => setCaterer(null))
      .finally(() => setLoading(false));
  }, [catererId]);

  const handleToggleFavorite = async () => {
    if (!caterer) return;
    setTogglingFavorite(true);
    setCaterer({ ...caterer, is_favorite: !caterer.is_favorite });
    try {
      await api.post(`client/favorites/toggle/${caterer.id}`);
    } catch {
      setCaterer({ ...caterer, is_favorite: caterer.is_favorite });
    } finally {
      setTogglingFavorite(false);
    }
  };

  if (loading) return <p className="text-[#58423d]">Chargement...</p>;
  if (!caterer) return <p className="text-[#58423d]">Traiteur introuvable.</p>;

  return (
    <div className="max-w-5xl">
      {/* En-tête */}
      <div className="bg-white border border-[#dfc0ba] rounded-xl overflow-hidden mb-6">
        <div className="h-48 bg-[#f3ede6] flex items-center justify-center relative">
          {caterer.gallery[0] ? (

            caterer.gallery[0].type == 'image' ?(
              <img src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.gallery[0].url}`} alt="" className="w-full h-full object-cover" />
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

        <div className="p-6 relative">
          <div className="flex items-start gap-4 -mt-16 mb-4">
            <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0 bg-[#f3ede6]">
              {caterer.logo_url ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.logo_url}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#9b2f1e]">
                  {caterer.company_name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 pt-16">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{caterer.company_name}</h1>
                  <p className="text-sm text-[#58423d] flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" strokeWidth={1.75} /> {caterer.location}
                  </p>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  disabled={togglingFavorite}
                  className={`p-3 rounded-full border transition-colors ${
                    caterer.is_favorite
                      ? 'bg-[#ffdad4] border-[#9b2f1e] text-[#9b2f1e]'
                      : 'bg-white border-[#dfc0ba] text-[#58423d] hover:border-[#9b2f1e]'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={caterer.is_favorite ? '#9b2f1e' : 'none'} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-[#7a4b00]" fill="#7a4b00" strokeWidth={1.5} />
              <span className="font-bold">{caterer.rating.toFixed(1)}</span>
              <span className="text-sm text-[#58423d]">({caterer.reviews_count} avis)</span>
            </div>
            {caterer.website && (
             <a 
                href={caterer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-[#9b2f1e] hover:underline"
              >
                <Globe className="w-4 h-4" strokeWidth={1.75} /> Site web
              </a>
            )}
            {caterer.contact && (
              <span className="flex items-center gap-1 text-sm text-[#58423d]">
                <Phone className="w-4 h-4" strokeWidth={1.75} /> {caterer.contact}
              </span>
            )}
          </div>

          <p className="text-[#58423d] mb-6">{caterer.description}</p>

          <div className="flex gap-3">
            <Link
              href={`/client/requests/new?caterer_id=${caterer.id}`}
              className="flex-1 text-center bg-[#9b2f1e] text-white py-3 rounded-full font-semibold hover:bg-[#872111] transition-colors"
            >
              Demander un devis
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 border border-[#dfc0ba] rounded-full font-semibold text-[#58423d] hover:bg-[#f9f3ec] transition-colors">
              <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
              Contacter
            </button>
          </div>
        </div>
      </div>

      {/* Galerie */}
      {caterer.gallery.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Galerie</h2>
          <div className="grid grid-cols-4 gap-3">
            {caterer.gallery.slice(0, 8).map((item) => (
              <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-[#f3ede6]">
                {item.type === 'image' ? (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${item.url}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={`${process.env.NEXT_PUBLIC_API_URL}${item.url}`} 
                      controls
                      className="w-full h-full object-cover" 
                    />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3">Services proposés</h2>
        {caterer.services.length === 0 ? (
          <p className="text-[#58423d]">Aucun service actif pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {caterer.services.map((service) => (
              <div key={service.id} className="bg-white border border-[#dfc0ba] rounded-xl overflow-hidden">
                <div className="h-32 bg-[#f3ede6] flex items-center justify-center">
                  {service.thumbnail_url ? (
                    service.thumbnail_type == 'image' ?(

                      <img src={`${process.env.NEXT_PUBLIC_API_URL}${service.thumbnail_url}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={`${process.env.NEXT_PUBLIC_API_URL}${service.thumbnail_url}`}
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
                    <ImageOff className="w-6 h-6 text-[#8b716c]" strokeWidth={1.5} />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold">{service.title}</h3>
                    <span className="font-bold text-[#9b2f1e] shrink-0">{Number(service.price)} €</span>
                  </div>
                  {service.category && (
                    <span className="inline-block bg-[#f3ede6] text-[#58423d] text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2">
                      {service.category.name}
                    </span>
                  )}
                  <p className="text-sm text-[#58423d] line-clamp-2">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Avis */}
      <section>
        <h2 className="text-lg font-bold mb-3">Avis clients</h2>
        {caterer.reviews.length === 0 ? (
          <p className="text-[#58423d]">Aucun avis pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {caterer.reviews.map((r) => (
              <div key={r.id} className="bg-white border border-[#dfc0ba] rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-sm">{r.user.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.rating ? 'text-[#7a4b00]' : 'text-[#e7e2db]'}`}
                        fill={i < r.rating ? '#7a4b00' : 'none'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-[#58423d]">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}