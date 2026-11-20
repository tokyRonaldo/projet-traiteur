// components/client/quotes/Quotes.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle2, XCircle, ImageOff } from 'lucide-react';
import { api } from '@/lib/api';
import FilterPopover, { FilterField, filterInputClass } from '@/components/shared/FilterPopover';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { Scale } from 'lucide-react'; // ajoute Scale à ton import lucide-react existant
import QuoteCompareModal from './QuoteCompareModal';

interface QuoteItem {
  id: number;
  proposed_price: number | string;
  message: string | null;
  status: 'sent' | 'accepted' | 'rejected';
  rejection_reason: string | null;
  caterer: {
    id: number;
    company_name: string;
    rating: number | string;
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
  { key: 'rejected', label: 'Refusé' },
];

const fmt = (n: number | string) => `${Number(n).toLocaleString('fr-FR')} €`;

export default function Quotes() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [selected, setSelected] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleSelect = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 4 ? prev : [...prev, id]
    );

  // Filtres avancés
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal accepter / refuser
  const [dialog, setDialog] = useState<{ type: 'accept' | 'reject'; quote: QuoteItem } | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

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

  const eventTypes = useMemo(
    () =>
      Array.from(new Set(quotes.map((q) => q.event_request?.event_type).filter((t): t is string => Boolean(t)))).sort(),
    [quotes]
  );

  const activeFilters = [minPrice, maxPrice, typeFilter].filter(Boolean).length;

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setTypeFilter('');
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return quotes.filter((q) => {
      const matchTab = activeTab === 'all' || q.status === activeTab;
      const matchSearch =
        q.caterer?.company_name?.toLowerCase().includes(term) ||
        q.event_request?.event_type?.toLowerCase().includes(term);

      const price = Number(q.proposed_price);
      const matchPrice = (!minPrice || price >= Number(minPrice)) && (!maxPrice || price <= Number(maxPrice));
      const matchType = !typeFilter || q.event_request?.event_type === typeFilter;

      return matchTab && matchSearch && matchPrice && matchType;
    });
  }, [quotes, activeTab, search, minPrice, maxPrice, typeFilter]);

  const closeDialog = () => {
    if (processingId !== null) return;
    setDialog(null);
    setDialogError(null);
  };

  const handleConfirm = async (reason: string) => {
    if (!dialog) return;
    const { type, quote } = dialog;

    setProcessingId(quote.id);
    setDialogError(null);
    try {
      if (type === 'accept') {
        const res = await api.post(`client/quote/${quote.id}/accept`);
        // on laisse le modal en chargement : la page change aussitôt
        router.push(res?.booking_id ? `/client/bookings/${res.booking_id}` : '/client/bookings');
        return;
      }

      await api.post(`client/quote/${quote.id}/reject`, { reason });
      setProcessingId(null);
      setDialog(null);
      loadQuotes();
    } catch (err: any) {
      setDialogError(err.message || 'Une erreur est survenue.');
      setProcessingId(null);
    }
  };

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
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

          <FilterPopover activeCount={activeFilters} onReset={resetFilters}>
            <div className="grid grid-cols-2 gap-2">
              <FilterField label="Prix min (€)">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className={filterInputClass}
                />
              </FilterField>
              <FilterField label="Prix max (€)">
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className={filterInputClass}
                />
              </FilterField>
            </div>
            <FilterField label="Type d'événement">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={filterInputClass}
              >
                <option value="">Tous</option>
                {eventTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </FilterField>
          </FilterPopover>
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
          <p className="text-[#58423d]">
            {activeFilters > 0 || search || activeTab !== 'all'
              ? 'Aucun devis ne correspond à ces critères.'
              : "Vous n'avez pas encore reçu de devis."}
          </p>
        </div>
      )}

      {/* Grille de devis */}
      <div className="grid grid-cols-12 gap-6 pb-8">
        {filtered.map((quote) => (
          <div key={quote.id} className="col-span-12 md:col-span-6 lg:col-span-4">
            <QuoteCard
              quote={quote}
              onAccept={() => setDialog({ type: 'accept', quote })}
              onReject={() => setDialog({ type: 'reject', quote })}
              processing={processingId === quote.id}
              selected={selected.includes(quote.id)}
              onToggleSelect={() => toggleSelect(quote.id)}
            />
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[#1d1b17] text-white pl-5 pr-2 py-2 rounded-full shadow-xl">
          <span className="text-sm">{selected.length} devis sélectionné(s)</span>
          <button
            onClick={() => setSelected([])}
            className="text-xs text-white/70 hover:text-white"
          >
            Effacer
          </button>
          <button
            onClick={() => setCompareOpen(true)}
            disabled={selected.length < 2}
            className="flex items-center gap-2 bg-[#9b2f1e] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-40"
          >
            <Scale className="w-4 h-4" strokeWidth={1.75} />
            Comparer
          </button>
        </div>
      )}

      {compareOpen && <QuoteCompareModal quoteIds={selected} onClose={() => setCompareOpen(false)} />}

      {dialog && (
        <ConfirmModal
          title={dialog.type === 'accept' ? 'Accepter ce devis ?' : 'Refuser ce devis ?'}
          message={
            dialog.type === 'accept' ? (
              <>
                Vous acceptez le devis de <strong>{dialog.quote.caterer.company_name}</strong> à{' '}
                <strong>{fmt(dialog.quote.proposed_price)}</strong>. Votre réservation sera confirmée et les autres
                devis en attente pour cet événement seront refusés.
              </>
            ) : (
              <>
                Le devis de <strong>{dialog.quote.caterer.company_name}</strong> ({fmt(dialog.quote.proposed_price)})
                sera refusé.
              </>
            )
          }
          confirmLabel={dialog.type === 'accept' ? 'Accepter le devis' : 'Refuser le devis'}
          variant={dialog.type === 'reject' ? 'danger' : 'primary'}
          withReason={dialog.type === 'reject'}
          loading={processingId === dialog.quote.id}
          error={dialogError}
          onConfirm={handleConfirm}
          onCancel={closeDialog}
        />
      )}
    </div>
  );
}

function QuoteCard({
  quote, onAccept, onReject, processing, selected, onToggleSelect,
}: {
  quote: QuoteItem;
  onAccept: () => void;
  onReject: () => void;
  processing: boolean;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const isRejected = quote.status === 'rejected';
  const isAccepted = quote.status === 'accepted';

  return (
    <div
      className={`bg-white border rounded-xl p-5 h-full flex flex-col shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
        isAccepted
          ? 'border-[#9b2f1e]/40'
          : isRejected
          ? 'border-[#dfc0ba]/50 opacity-70 grayscale-[0.3]'
          : 'border-[#dfc0ba]'
      }`}
    >
      <label className="flex items-center gap-2 text-xs text-[#58423d] mb-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="accent-[#9b2f1e]"
        />
        Comparer
      </label>
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-[#f3ede6] flex items-center justify-center overflow-hidden shrink-0">
          {quote.caterer.logo_url ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${quote.caterer.logo_url}`}
              alt=""
              className="w-full h-full object-cover"
            />
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

      <h3 className="font-bold text-[#1d1b17] mb-1">{quote.caterer.company_name}</h3>
      <div className="flex items-center gap-1 text-xs text-[#58423d] mb-2">
        <Star className="w-3.5 h-3.5 text-[#7a4b00]" fill="#7a4b00" strokeWidth={1.5} />
        {Number(quote.caterer.rating).toFixed(1)}
      </div>

      <p className="text-sm text-[#58423d] mb-4">{quote.event_request.event_type}</p>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-[#1d1b17]">{fmt(quote.proposed_price)}</span>
        <span className="text-sm text-[#8b716c]">/ {quote.event_request.guests_number} pers.</span>
      </div>

      {quote.message && <p className="text-sm text-[#58423d] line-clamp-2 mb-4">{quote.message}</p>}

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
              Accepter
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