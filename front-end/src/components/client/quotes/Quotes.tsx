// components/client/quotes/Quotes.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  Star,
  CheckCircle2,
  XCircle,
  ImageOff,
} from 'lucide-react';
import { api } from '@/lib/api';

interface QuoteItem {
  id: number;
  proposed_price: number;
  message: string | null;
  status: 'sent' | 'accepted' | 'rejected';
  rejection_reason: string | null;
  caterer: {
    id: number;
    company_name: string;
    rating: number;
    logo_url?: string | null;
  };
  event_request: {
    event_type: string;
    guests_number: number;
    event_date: string;
  };
}

const TABS = [
  { key: 'all', label: 'Tous' },
  { key: 'sent', label: 'En attente' },
  { key: 'accepted', label: 'Acceptés' },
];

export default function Quotes() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadQuotes = () => {
    setLoading(true);
    api
      .get('client/quotes')
      .then((res) => setQuotes(res.data ?? res))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      const matchTab = activeTab === 'all' || q.status === activeTab;
      const matchSearch =
        q.caterer.company_name.toLowerCase().includes(search.toLowerCase()) ||
        q.event_request.event_type.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [quotes, activeTab, search]);

  const handleAccept = async (quote: QuoteItem) => {
    if (
      !confirm(
        `Accepter ce devis de ${quote.caterer.company_name} pour ${quote.proposed_price.toLocaleString()} € ? Cela confirmera votre réservation et refusera les autres devis en attente pour cet événement.`
      )
    )
      return;

    setProcessingId(quote.id);
    try {
      await api.post(`client/quote/${quote.id}/accept`);
      loadQuotes();
    } catch (err: any) {
      alert(err.message || "Impossible d'accepter ce devis.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (quote: QuoteItem) => {
    const reason = prompt('Raison du refus (optionnel) :') ?? '';
    if (!confirm('Confirmer le refus de ce devis ?')) return;

    setProcessingId(quote.id);
    try {
      await api.post(`client/quote/${quote.id}/reject`, { reason });
      loadQuotes();
    } catch (err: any) {
      alert(err.message || 'Impossible de refuser ce devis.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1d1b17]">Mes devis</h2>
          <p className="text-[#58423d] mt-1">Comparez et gérez les propositions reçues pour vos événements.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-[#f3ede6] rounded-lg p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-[#9b2f1e] shadow-sm'
                    : 'text-[#58423d] hover:text-[#9b2f1e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 border border-[#dfc0ba] px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#f9f3ec] transition-colors">
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
            Filtrer
          </button>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-6 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un traiteur ou un type d'événement..."
          className="w-full bg-white border border-[#dfc0ba] rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all"
        />
      </div>

      {loading && <p className="text-[#58423d]">Chargement des devis...</p>}

      {!loading && filtered.length === 0 && (
        <div className="bg-white border border-[#dfc0ba] rounded-xl p-10 text-center">
          <p className="text-[#58423d]">Aucun devis dans cette catégorie.</p>
        </div>
      )}

      {/* Grille de devis */}
      <div className="grid grid-cols-12 gap-6 pb-8">
        {filtered.map((quote) => (
          <div key={quote.id} className="col-span-12 md:col-span-6 lg:col-span-4">
            <QuoteCard
              quote={quote}
              onAccept={() => handleAccept(quote)}
              onReject={() => handleReject(quote)}
              processing={processingId === quote.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteCard({
  quote,
  onAccept,
  onReject,
  processing,
}: {
  quote: QuoteItem;
  onAccept: () => void;
  onReject: () => void;
  processing: boolean;
}) {
  const isRejected = quote.status === 'rejected';
  const isAccepted = quote.status === 'accepted';

  return (
    <div
      className={`bg-white border rounded-xl p-5 h-full flex flex-col shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
        isAccepted ? 'border-[#9b2f1e]/40' : isRejected ? 'border-[#dfc0ba]/50 opacity-70 grayscale-[0.3]' : 'border-[#dfc0ba]'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-[#f3ede6] flex items-center justify-center overflow-hidden shrink-0">
          {quote.caterer.logo_url ? (
            <img src={quote.caterer.logo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageOff className="w-5 h-5 text-[#8b716c]" strokeWidth={1.5} />
          )}
        </div>

        {isAccepted && (
          <span className="px-3 py-1 rounded-full bg-[#9b2f1e] text-white text-[10px] font-bold uppercase">
            Accepté
          </span>
        )}
        {isRejected && (
          <span className="px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold uppercase">
            Refusé
          </span>
        )}
        {quote.status === 'sent' && (
          <span className="px-3 py-1 rounded-full bg-[#e7e2db] text-[#58423d] text-[10px] font-bold uppercase">
            En attente
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-bold text-[#1d1b17]">{quote.caterer.company_name}</h3>
      </div>
      <div className="flex items-center gap-1 text-xs text-[#58423d] mb-2">
        <Star className="w-3.5 h-3.5 text-[#7a4b00]" fill="#7a4b00" strokeWidth={1.5} />
        {quote.caterer.rating.toFixed(1)}
      </div>

      <p className="text-sm text-[#58423d] mb-4">{quote.event_request.event_type}</p>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-[#1d1b17]">
          {quote.proposed_price.toLocaleString()} €
        </span>
        <span className="text-sm text-[#8b716c]">/ {quote.event_request.guests_number} pers.</span>
      </div>

      {quote.message && (
        <p className="text-sm text-[#58423d] line-clamp-2 mb-4">{quote.message}</p>
      )}

      {isRejected && quote.rejection_reason && (
        <p className="text-xs text-[#8b716c] italic mb-4">&quot;{quote.rejection_reason}&quot;</p>
      )}

      <div className="mt-auto space-y-2">
        {quote.status === 'sent' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReject}
              disabled={processing}
              className="flex items-center justify-center gap-1 border border-[#dfc0ba] text-[#58423d] py-2 rounded-lg text-sm font-semibold hover:bg-[#f9f3ec] transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" strokeWidth={1.75} />
              Refuser
            </button>
            <button
              onClick={onAccept}
              disabled={processing}
              className="flex items-center justify-center gap-1 bg-[#9b2f1e] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
              {processing ? '...' : 'Accepter'}
            </button>
          </div>
        )}

        {isAccepted && (
          <Link
            href="/client/bookings"
            className="block w-full text-center bg-[#f3ede6] text-[#1d1b17] py-2 rounded-lg text-sm font-semibold hover:bg-[#ede7e0] transition-colors"
          >
            Voir la réservation
          </Link>
        )}
      </div>
    </div>
  );
}