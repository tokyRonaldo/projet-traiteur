// components/caterer/requests/EventRequests.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Download,
  ArrowRight,
  X,
  Send,
  MessageCircle,
  History,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import QuoteCreateModal from '../quotes/QuoteCreateModal';

interface EventRequestItem {
  id: number;
  client:{
    name : string,
    phone : string
  };
  event_type: string;
  event_date: string;
  guests_number: number;
  budget: number;
  message: string;
  status: 'pending' | 'responded' | 'rejected' | 'accepted';
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Nouvelle',
  responded: 'Répondue',
  accepted: 'Confirmé',
  rejected: 'Refusé',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#9b2f1e] text-white',
  responded: 'bg-[#dae1e3] text-[#5d6466]',
  draft: 'bg-[#e7e2db] text-[#58423d]',
  accepted: 'bg-green-100 text-green-700',
};

export default function EventRequests() {
  const [requests, setRequests] = useState<EventRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<EventRequestItem | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 4;
  const [quoteModalRequest, setQuoteModalRequest] = useState<EventRequestItem | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get('caterer/event-requests')
      .then((res) => setRequests(res.data ?? res))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchStatus = !statusFilter || r.status === statusFilter;
      const matchSearch = r.client?.name.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [requests, statusFilter, search]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    responded: requests.filter((r) => r.status === 'responded').length,
    draft: requests.filter((r) => r.status === 'draft').length,
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#9b2f1e] mb-1">Demandes</h2>
          <p className="text-[#58423d]">Gérez vos demandes entrantes et proposez vos offres.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dfc0ba] rounded-lg text-[#58423d] hover:bg-[#f9f3ec] transition-all">
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-sm font-semibold">Filtres</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dfc0ba] rounded-lg text-[#58423d] hover:bg-[#f9f3ec] transition-all">
            <Download className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-sm font-semibold">Exporter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => {
            setStatusFilter(null);
            setPage(1);
          }}
          className={
            !statusFilter
              ? 'p-4 rounded-xl border-2 border-[#9b2f1e] bg-[#bc4733]/5 shadow-sm flex flex-col gap-1 text-left transition-colors'
              : 'p-4 rounded-xl border border-[#dfc0ba] bg-white shadow-sm flex flex-col gap-1 text-left transition-colors hover:border-[#9b2f1e]'
          }
        >
          <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">Toutes</span>
          <span className="text-2xl font-bold">{counts.all}</span>
        </button>

        <button
          onClick={() => {
            setStatusFilter('pending');
            setPage(1);
          }}
          className={
            statusFilter === 'pending'
              ? 'p-4 rounded-xl border-2 border-[#9b2f1e] bg-[#bc4733]/5 shadow-sm flex flex-col gap-1 text-left transition-colors'
              : 'p-4 rounded-xl border border-[#dfc0ba] bg-white shadow-sm flex flex-col gap-1 text-left transition-colors hover:border-[#9b2f1e]'
          }
        >
          <span className="text-[#9b2f1e] text-xs font-bold uppercase tracking-wider">Nouvelles</span>
          <span className="text-2xl font-bold text-[#9b2f1e]">{String(counts.pending).padStart(2, '0')}</span>
        </button>

        <button
          onClick={() => {
            setStatusFilter('responded');
            setPage(1);
          }}
          className={
            statusFilter === 'responded'
              ? 'p-4 rounded-xl border-2 border-[#9b2f1e] bg-[#bc4733]/5 shadow-sm flex flex-col gap-1 text-left transition-colors'
              : 'p-4 rounded-xl border border-[#dfc0ba] bg-white shadow-sm flex flex-col gap-1 text-left transition-colors hover:border-[#9b2f1e]'
          }
        >
          <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">Répondues</span>
          <span className="text-2xl font-bold">{String(counts.responded).padStart(2, '0')}</span>
        </button>

        <button
          onClick={() => {
            setStatusFilter('draft');
            setPage(1);
          }}
          className={
            statusFilter === 'draft'
              ? 'p-4 rounded-xl border-2 border-[#9b2f1e] bg-[#bc4733]/5 shadow-sm flex flex-col gap-1 text-left transition-colors'
              : 'p-4 rounded-xl border border-[#dfc0ba] bg-white shadow-sm flex flex-col gap-1 text-left transition-colors hover:border-[#9b2f1e]'
          }
        >
          <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">Brouillons</span>
          <span className="text-2xl font-bold">{String(counts.draft).padStart(2, '0')}</span>
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un client..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#dfc0ba] rounded-full text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dfc0ba] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9f3ec] border-b border-[#dfc0ba]">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Date reçue</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Client</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Budget</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Statut</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfc0ba]/50">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-[#58423d]">
                    Chargement...
                  </td>
                </tr>
              )}

              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-[#58423d]">
                    Aucune demande trouvée.
                  </td>
                </tr>
              )}

              {paginated.map((r) => (
                <tr key={r.id} className="hover:bg-[#f9f3ec] transition-colors">
                  <td className="px-4 py-4">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#dae1e3] flex items-center justify-center text-[#586062] font-bold text-xs">
                        {getInitials(r.client?.name)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{r.client?.name}</p>
                        <p className="text-xs text-[#58423d]">{r.client?.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-[#ffb961]/20 text-[#7a4b00] px-2 py-1 rounded text-xs font-bold uppercase">
                      {r.event_type}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-[#9b2f1e]">{r.budget.toLocaleString()} €</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${STATUS_STYLES[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setSelected(r)}
                      className="text-[#9b2f1e] hover:underline text-sm font-semibold inline-flex items-center gap-1"
                    >
                      Voir détails
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="p-4 flex justify-between items-center bg-[#f9f3ec] border-t border-[#dfc0ba]">
            <p className="text-[#58423d] text-sm">
              Affichage de {paginated.length} sur {filtered.length} demandes
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-[#dfc0ba] hover:bg-[#ede7e0] transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={
                    page === p
                      ? 'w-8 h-8 flex items-center justify-center rounded border border-[#9b2f1e] bg-[#9b2f1e] text-white font-bold text-xs'
                      : 'w-8 h-8 flex items-center justify-center rounded border border-[#dfc0ba] hover:bg-[#ede7e0] font-bold text-xs'
                  }
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-[#dfc0ba] hover:bg-[#ede7e0] transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#9b2f1e] text-white rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg mb-1">Envie d&apos;augmenter vos réponses ?</h3>
          <p className="opacity-90 text-sm max-w-md">
            Un temps de réponse rapide augmente vos chances de conversion. Consultez vos statistiques pour suivre vos performances.
          </p>
        </div>
        <Link
          href="/caterer/statistics"
          className="bg-white text-[#9b2f1e] px-5 py-2 rounded-full font-bold text-sm shrink-0 hover:bg-[#f9f3ec] transition-all"
        >
          Voir les statistiques
        </Link>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="w-full max-w-xl h-full bg-[#fef8f1] shadow-2xl flex flex-col">
            <div className="p-6 border-b border-[#dfc0ba] flex justify-between items-start">
              <div>
                <span className="text-[#9b2f1e] text-xs font-semibold uppercase tracking-widest block mb-1">
                  Demande #{selected.id}
                </span>
                <h2 className="text-2xl font-bold text-[#1d1b17]">{selected.client?.name}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-[#ede7e0] rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#58423d] text-xs font-bold uppercase">Date souhaitée</p>
                  <p>{new Date(selected.event_date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-[#58423d] text-xs font-bold uppercase">Nombre d&apos;invités</p>
                  <p>{selected.guests_number} invités</p>
                </div>
                <div>
                  <p className="text-[#58423d] text-xs font-bold uppercase">Lieu</p>
                  <p>{selected.client?.phone}</p>
                </div>
                <div>
                  <p className="text-[#58423d] text-xs font-bold uppercase">Budget</p>
                  <p className="text-[#9b2f1e] font-bold">{selected.budget.toLocaleString()} €</p>
                </div>
              </div>

              <div>
                <p className="text-[#58423d] text-xs font-bold uppercase mb-2">Message du client</p>
                <div className="bg-[#f3ede6] p-4 rounded-lg border-l-4 border-[#7a4b00]">
                  <p className="italic text-[#1d1b17]">{selected.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setQuoteModalRequest(selected)}
                  className="bg-[#9b2f1e] text-white py-4 rounded-xl font-bold flex flex-col items-center gap-1 hover:bg-[#872111] transition-all"
                >
                  <Send className="w-5 h-5" strokeWidth={1.75} />
                  Envoyer un devis
                </button>
                <Link
                  href={`/caterer/messages?client=${selected.id}`}
                  className="bg-white border-2 border-[#9b2f1e] text-[#9b2f1e] py-4 rounded-xl font-bold flex flex-col items-center gap-1 hover:bg-[#9b2f1e]/5 transition-all"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                  Contacter le client
                </Link>
              </div>
              <div className="p-4 rounded-xl border border-[#dfc0ba] space-y-2">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#9b2f1e]" strokeWidth={1.75} />
                  <p className="font-bold">Historique</p>
                </div>
                <div className="border-l-2 border-[#dfc0ba]/50 ml-1.5 pl-6 relative">
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#9b2f1e]" />
                    <p className="text-xs text-[#58423d]">
                      {new Date(selected.created_at).toLocaleString('fr-FR')}
                    </p>
                    <p>Demande reçue de {selected.client?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-[#dfc0ba] flex gap-3">
              <button className="flex-1 bg-[#e7e2db] text-[#58423d] py-2 rounded-full font-bold hover:bg-[#dfc0ba] transition-colors"
              onClick={()=>{setSelected(null)}}
              >
                Ignorer
              </button>
              <button className="flex-1 bg-[#586062] text-white py-2 rounded-full font-bold hover:opacity-90 transition-opacity">
                Archiver
              </button>
            </div>
          </div>
        </div>
      )}
      {quoteModalRequest && (
        <QuoteCreateModal
          eventRequest={{
            id: quoteModalRequest.id,
            client_name: quoteModalRequest.client?.name,
            event_type: quoteModalRequest.event_type,
            event_date: quoteModalRequest.event_date,
            guests_number: quoteModalRequest.guests_number,
            budget: quoteModalRequest.budget,
            message: quoteModalRequest.message,
          }}
          onClose={() => setQuoteModalRequest(null)}
          onSent={() => {
            // Recharge la liste pour refléter le nouveau statut "responded"
            setLoading(true);
            api
              .get('caterer/event-requests')
              .then((res) => setRequests(res.data ?? res))
              .finally(() => {
                setLoading(false)
                setSelected(null);
              }
              );
          }}
        />
      )}
    </div>
  );
}