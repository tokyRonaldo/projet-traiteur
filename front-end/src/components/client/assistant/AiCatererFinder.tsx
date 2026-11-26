// components/client/assistant/AiCatererFinder.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Star, MapPin, ImageOff } from 'lucide-react';
import { api } from '@/lib/api';

interface Criteria {
  event_type?: string;
  guests_number?: number;
  budget?: number;
  event_date?: string;
  location?: string;
  keywords?: string[];
}

interface CatererResult {
  id: number;
  company_name: string;
  description: string | null;
  rating: number | string;
  average_price: number | string | null;
  logo_url: string | null;
  location: string | null;
}

const EXAMPLE = 'Mariage en juin, 80 personnes, budget 4000 €, cuisine malgache à Antananarivo';

export default function AiCatererFinder() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<Criteria | null>(null);
  const [caterers, setCaterers] = useState<CatererResult[]>([]);

  const search = async () => {
    if (text.trim().length < 10 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('client/assistant/find-caterers', { text: text.trim() });
      setCriteria(res.criteria);
      setCaterers(res.caterers ?? []);
    } catch (err: any) {
      setError(err.message || 'La recherche a échoué. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  // Paramètres transmis à la fiche traiteur (pour pré-remplir la demande plus tard)
  const queryFor = () => {
    const p = new URLSearchParams();
    if (criteria?.event_type) p.set('type', criteria.event_type);
    if (criteria?.guests_number) p.set('guests', String(criteria.guests_number));
    if (criteria?.budget) p.set('budget', String(criteria.budget));
    if (criteria?.event_date) p.set('date', criteria.event_date);
    const s = p.toString();
    return s ? `?${s}` : '';
  };

  const chips = criteria
    ? [
        criteria.event_type,
        criteria.guests_number ? `${criteria.guests_number} invités` : null,
        criteria.budget ? `${Number(criteria.budget).toLocaleString('fr-FR')} €` : null,
        criteria.event_date ? new Date(criteria.event_date).toLocaleDateString('fr-FR') : null,
        criteria.location,
        ...(criteria.keywords ?? []),
      ].filter(Boolean)
    : [];

  return (
    <div className="bg-white border border-[#dfc0ba] rounded-2xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-[#9b2f1e]" strokeWidth={1.75} />
        <h3 className="font-bold text-[#1d1b17]">Décrivez votre événement</h3>
      </div>

      <textarea
        rows={3}
        value={text}
        maxLength={500}
        onChange={(e) => setText(e.target.value)}
        placeholder={EXAMPLE}
        className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] resize-none"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-[#8b716c]">{text.length}/500</span>
        <button
          onClick={search}
          disabled={loading || text.trim().length < 10}
          className="px-5 py-2 bg-[#9b2f1e] text-white rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
        >
          {loading ? 'Recherche...' : 'Trouver des traiteurs'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {criteria && !loading && (
        <div className="mt-5">
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-[#58423d] self-center">Ce que j&apos;ai compris :</span>
              {chips.map((c, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-[#ffdad4] text-[#9b2f1e] rounded-full font-semibold">
                  {c}
                </span>
              ))}
            </div>
          )}

          {caterers.length === 0 ? (
            <p className="text-sm text-[#58423d]">Aucun traiteur ne correspond pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {caterers.map((c) => (
                <Link
                  key={c.id}
                  href={`/client/caterers/${c.id}${queryFor()}`}
                  className="flex gap-3 p-3 border border-[#dfc0ba] rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#f3ede6] flex items-center justify-center overflow-hidden shrink-0">
                    {c.logo_url ? (
                      <img
                        src={`${process.env.LARAVEL_API_URL}${c.logo_url}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageOff className="w-5 h-5 text-[#8b716c]" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-[#1d1b17] truncate">{c.company_name}</p>
                      <span className="flex items-center gap-1 text-xs text-[#58423d] shrink-0">
                        <Star className="w-3 h-3 text-[#7a4b00]" fill="#7a4b00" strokeWidth={1.5} />
                        {Number(c.rating).toFixed(1)}
                      </span>
                    </div>
                    {c.description && <p className="text-xs text-[#58423d] line-clamp-1">{c.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#8b716c]">
                      {c.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" strokeWidth={1.75} />
                          {c.location}
                        </span>
                      )}
                      {c.average_price && <span>dès {Number(c.average_price).toLocaleString('fr-FR')} € / pers.</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}