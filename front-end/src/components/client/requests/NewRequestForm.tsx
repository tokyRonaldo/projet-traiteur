// components/client/requests/NewRequestForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, CheckCircle2, ImageOff } from 'lucide-react';
import { api } from '@/lib/api';

interface CatererOption {
  id: number;
  company_name: string;
  location: string;
  logo_url: string | null;
}

const EVENT_TYPES = [
  'Mariage',
  'Anniversaire',
  'Cocktail Entreprise',
  'Séminaire',
  'Fête privée',
  'Autre',
];

export default function NewRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCatererId = searchParams.get('caterer_id');

  const [selectedCaterer, setSelectedCaterer] = useState<CatererOption | null>(null);
  const [catererQuery, setCatererQuery] = useState('');
  const [catererResults, setCatererResults] = useState<CatererOption[]>([]);
  const [searchingCaterer, setSearchingCaterer] = useState(false);

  const [form, setForm] = useState({
    event_type: '',
    event_date: '',
    guests_number: '',
    budget: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pré-remplit le traiteur si on arrive avec ?caterer_id=X (depuis un profil)
  useEffect(() => {
    if (!preselectedCatererId) return;
    api
      .get(`client/caterers/search?q=`) // fallback simple, sinon route dédiée
      .catch(() => {});

    api
      .get(`client/caterer/${preselectedCatererId}`)
      .then((data) =>
        setSelectedCaterer({
          id: data.id,
          company_name: data.company_name,
          location: data.location,
          logo_url: data.logo_url ?? null,
        })
      )
      .catch(() => {});
  }, [preselectedCatererId]);

  // Recherche de traiteur (si aucun présélectionné)
  useEffect(() => {
    if (catererQuery.trim().length < 2) {
      setCatererResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      setSearchingCaterer(true);
      api
        .get(`client/caterers/search?q=${encodeURIComponent(catererQuery)}`)
        .then((res) => setCatererResults(res.data ?? []))
        .catch(() => setCatererResults([]))
        .finally(() => setSearchingCaterer(false));
    }, 350);
    return () => clearTimeout(timeout);
  }, [catererQuery]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!selectedCaterer) {
      setError('Merci de sélectionner un traiteur.');
      return;
    }
    if (!form.event_type || !form.event_date || !form.guests_number) {
      setError('Merci de remplir tous les champs obligatoires.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('client/event-request/store', {
        caterer_id: selectedCaterer.id,
        event_type: form.event_type,
        event_date: form.event_date,
        guests_number: form.guests_number,
        budget: form.budget || null,
        message: form.message || null,
      });
      setSuccess(true);
      setTimeout(() => router.push('/client/requests'), 1500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  if (success) {
    return (
      <div className="max-w-lg mx-auto bg-white border border-[#dfc0ba] rounded-xl p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" strokeWidth={1.75} />
        <h2 className="text-xl font-bold mb-1">Demande envoyée !</h2>
        <p className="text-[#58423d]">
          {selectedCaterer?.company_name} recevra votre demande et pourra vous répondre par devis.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17]">Nouvelle demande</h2>
        <p className="text-[#58423d]">Décrivez votre événement pour recevoir un devis personnalisé.</p>
      </header>

      <div className="bg-white border border-[#dfc0ba] rounded-xl p-6 space-y-5">
        {/* Sélection du traiteur */}
        <div>
          <label className="block text-xs font-semibold text-[#58423d] mb-2">Traiteur *</label>

          {selectedCaterer ? (
            <div className="flex items-center justify-between bg-[#f9f3ec] border border-[#dfc0ba] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center overflow-hidden shrink-0">
                  {selectedCaterer.logo_url ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${selectedCaterer.logo_url}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff className="w-4 h-4 text-[#8b716c]" strokeWidth={1.5} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{selectedCaterer.company_name}</p>
                  <p className="text-xs text-[#58423d]">{selectedCaterer.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCaterer(null)}
                className="p-1.5 hover:bg-[#ede7e0] rounded-full transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
              <input
                type="text"
                value={catererQuery}
                onChange={(e) => setCatererQuery(e.target.value)}
                placeholder="Rechercher un traiteur par nom ou ville..."
                className="w-full pl-9 pr-3 py-2 border border-[#dfc0ba] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
              />

              {catererQuery.trim().length >= 2 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-[#dfc0ba] rounded-lg shadow-lg max-h-56 overflow-y-auto z-10">
                  {searchingCaterer && <p className="p-3 text-sm text-[#58423d]">Recherche...</p>}
                  {!searchingCaterer && catererResults.length === 0 && (
                    <p className="p-3 text-sm text-[#58423d]">Aucun traiteur trouvé.</p>
                  )}
                  {catererResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCaterer(c);
                        setCatererQuery('');
                        setCatererResults([]);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#f9f3ec] transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#ffdad4] flex items-center justify-center overflow-hidden shrink-0">
                        {c.logo_url ? (
                          <img src={`${process.env.NEXT_PUBLIC_API_URL}${c.logo_url}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff className="w-3.5 h-3.5 text-[#8b716c]" strokeWidth={1.5} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{c.company_name}</p>
                        <p className="text-xs text-[#58423d]">{c.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Type d'événement */}
        <div>
          <label className="block text-xs font-semibold text-[#58423d] mb-1">Type d'événement *</label>
          <select
            value={form.event_type}
            onChange={(e) => handleChange('event_type', e.target.value)}
            className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
          >
            <option value="">Sélectionner...</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Date de l'événement *</label>
            <input
              type="date"
              value={form.event_date}
              min={todayStr}
              onChange={(e) => handleChange('event_date', e.target.value)}
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Nombre d'invités *</label>
            <input
              type="number"
              min="1"
              value={form.guests_number}
              onChange={(e) => handleChange('guests_number', e.target.value)}
              placeholder="Ex : 80"
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#58423d] mb-1">Budget estimé (€, optionnel)</label>
          <input
            type="number"
            min="0"
            value={form.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            placeholder="Ex : 25000"
            className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#58423d] mb-1">Message pour le traiteur</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Décrivez vos besoins : type de menu, restrictions alimentaires, ambiance souhaitée..."
            className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all resize-y"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[#9b2f1e] text-white py-3 rounded-full font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
        >
          {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
        </button>
      </div>
    </div>
  );
}