// components/caterer/quotes/Quotes.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Send,
  CheckCircle2,
  FileText,
  Banknote,
  MoreVertical,
  Pencil,
  ReceiptText,
  ImageOff,
} from 'lucide-react';
import { api } from '@/lib/api';

interface QuoteItem {
  id: number;
  event_title: string;
  client_name: string;
  event_date: string;
  proposed_price: number;
  guests_number: number;
  service_type: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  rejection_reason?: string;
  updated_at: string;
}

const TABS = [
  { key: 'all', label: 'Tous les devis' },
  { key: 'draft', label: 'Brouillons' },
  { key: 'sent', label: 'Envoyés' },
  { key: 'accepted', label: 'Acceptés' },
];

const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-[#e7e2db] text-[#58423d]',
  sent: 'bg-[#ffb4a6] text-[#872111]',
  accepted: 'bg-[#ffddb9] text-[#663e00]',
  rejected: 'bg-[#ffdad6] text-[#93000a]',
};

export default function Quotes() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    setLoading(true);
    api
      .get('caterer/quotes') // adapte à ta vraie route
      .then((res) => setQuotes(res.data ?? res))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return quotes;
    return quotes.filter((q) => q.status === activeTab);
  }, [quotes, activeTab]);

  const visible = filtered.slice(0, visibleCount);

  const counts = {
    sent: quotes.filter((q) => q.status === 'sent').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length,
    draft: quotes.filter((q) => q.status === 'draft').length,
    pipeline: quotes
      .filter((q) => q.status === 'sent' || q.status === 'draft')
      .reduce((sum, q) => sum + q.proposed_price, 0),
  };

  const conversionRate =
    counts.sent + counts.accepted > 0
      ? Math.round((counts.accepted / (counts.sent + counts.accepted)) * 100)
      : 0;

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1d1b17]">Gestion des devis</h2>
          <p className="text-[#58423d] mt-1">Suivez et gérez vos propositions de service.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/caterer/statistics"
            className="px-4 py-2 border-2 border-[#9b2f1e] text-[#9b2f1e] rounded-full font-bold hover:bg-[#9b2f1e]/5 transition-all"
          >
            Voir les statistiques
          </Link>
          <button className="px-4 py-2 bg-[#9b2f1e] text-white rounded-full font-bold shadow-md hover:-translate-y-0.5 transition-all">
            Créer un devis
          </button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-sm border border-[#dfc0ba] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9b2f1e] bg-[#ffdad4] p-2 rounded-lg">
              <Send className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <span className="text-xs text-[#58423d]">Envoyés</span>
          </div>
          <p className="text-2xl font-bold">{counts.sent}</p>
          <p className="text-xs text-[#58423d] mt-1">Sur {quotes.length} au total</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-[#dfc0ba] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#7a4b00] bg-[#ffddb9] p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <span className="text-xs text-[#58423d]">Acceptés</span>
          </div>
          <p className="text-2xl font-bold">{counts.accepted}</p>
          <p className="text-xs text-[#58423d] mt-1">{conversionRate}% de taux de conversion</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-[#dfc0ba] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#586062] bg-[#dde4e6] p-2 rounded-lg">
              <FileText className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <span className="text-xs text-[#58423d]">Brouillons</span>
          </div>
          <p className="text-2xl font-bold">{counts.draft}</p>
          <p className="text-xs text-[#58423d] mt-1">En attente de détails</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-[#dfc0ba] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9b2f1e] bg-[#ffdad4] p-2 rounded-lg">
              <Banknote className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <span className="text-xs text-[#58423d]">Pipeline total</span>
          </div>
          <p className="text-2xl font-bold">{counts.pipeline.toLocaleString()} €</p>
          <p className="text-xs text-[#58423d] mt-1">En attente d'approbation</p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex items-center gap-6 border-b border-[#dfc0ba] mb-4 px-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setVisibleCount(4);
            }}
            className={`pb-2 font-semibold transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-[#9b2f1e] text-[#9b2f1e]'
                : 'text-[#58423d] hover:text-[#9b2f1e]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Liste des devis */}
      <div className="space-y-3">
        {loading && <p className="text-[#58423d] py-6">Chargement des devis...</p>}

        {!loading && visible.length === 0 && (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#f3ede6] rounded-full flex items-center justify-center mb-3">
              <ReceiptText className="w-7 h-7 text-[#8b716c]" strokeWidth={1.5} />
            </div>
            <p className="text-[#58423d]">Aucun devis dans cette catégorie.</p>
          </div>
        )}

        {visible.map((quote) => (
          <div
            key={quote.id}
            className={`bg-white/70 backdrop-blur-sm border border-[#dfc0ba] p-4 rounded-xl flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer ${
              quote.status === 'draft' ? 'border-dashed opacity-90' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#f3ede6] flex items-center justify-center shrink-0">
                <ImageOff className="w-5 h-5 text-[#8b716c]" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[#1d1b17] group-hover:text-[#9b2f1e] transition-colors">
                  {quote.event_title}
                </h4>
                <p className="text-xs text-[#58423d] uppercase tracking-wider">
                  Client : {quote.client_name} • {new Date(quote.event_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xl font-bold text-[#9b2f1e]">
                  {quote.proposed_price.toLocaleString()} €
                </p>
                <p className="text-xs text-[#58423d]">
                  {quote.guests_number} invités • {quote.service_type}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[quote.status]}`}>
                  {STATUS_LABELS[quote.status]}
                </span>
                <p className="text-[10px] text-[#58423d]">
                  {quote.status === 'rejected' && quote.rejection_reason
                    ? quote.rejection_reason
                    : `Modifié le ${new Date(quote.updated_at).toLocaleDateString('fr-FR')}`}
                </p>
              </div>

              <button className="p-2 text-[#58423d] hover:text-[#9b2f1e] transition-colors">
                {quote.status === 'draft' ? (
                  <Pencil className="w-4 h-4" strokeWidth={1.75} />
                ) : (
                  <MoreVertical className="w-4 h-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Charger plus */}
      {filtered.length > visibleCount && (
        <div className="mt-6 py-6 flex flex-col items-center justify-center text-center">
          <p className="text-[#1d1b17] font-bold mb-2">
            Affichage de {visible.length} sur {filtered.length} devis
          </p>
          <button
            onClick={() => setVisibleCount((c) => c + 4)}
            className="text-[#9b2f1e] font-bold hover:underline"
          >
            Charger plus de devis
          </button>
        </div>
      )}
    </div>
  );
}