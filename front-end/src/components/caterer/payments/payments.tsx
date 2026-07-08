// components/caterer/payments/Payments.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Banknote,
  Hourglass,
  CalendarDays,
  SlidersHorizontal,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Landmark,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';

interface PaymentItem {
  id: number;
  client_name: string;
  event_type: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  paid_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  completed: 'Terminé',
  pending: 'En attente',
  cancelled: 'Annulé',
};

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-orange-100 text-orange-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_DOT: Record<string, string> = {
  completed: 'bg-green-600',
  pending: 'bg-orange-600',
  cancelled: 'bg-red-600',
};

export default function Payments() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    setLoading(true);
    api
      .get('caterer/payments') // adapte à ta vraie route
      .then((res) => setPayments(res.data ?? res))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchStatus = !statusFilter || p.status === statusFilter;
      const matchSearch = p.client_name.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [payments, statusFilter, search]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const now = new Date();
  const thisMonth = payments.filter((p) => {
    const d = new Date(p.paid_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && p.status === 'completed';
  });
  const lastMonth = payments.filter((p) => {
    const d = new Date(p.paid_at);
    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return d.getMonth() === prevMonth && d.getFullYear() === prevYear && p.status === 'completed';
  });

  const totalRevenue = payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const thisMonthRevenue = thisMonth.reduce((s, p) => s + p.amount, 0);
  const lastMonthRevenue = lastMonth.reduce((s, p) => s + p.amount, 0);
  const growthPercent =
    lastMonthRevenue > 0 ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : null;

  const pendingTotal = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  // Estimation TVA basée sur les vraies transactions (indicative, à valider avec un comptable)
  const estimatedVAT = totalRevenue * 0.2;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17]">Paiements</h2>
        <p className="text-[#58423d]">Gérez vos revenus, vos factures et l'historique de vos transactions.</p>
      </div>

      {/* KPIs financiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-[#dfc0ba] p-4 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#9b2f1e]/10 text-[#9b2f1e] rounded-lg">
              <Banknote className="w-5 h-5" strokeWidth={1.75} />
            </div>
            {growthPercent !== null && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  growthPercent >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                }`}
              >
                {growthPercent >= 0 ? '+' : ''}
                {growthPercent}% ce mois
              </span>
            )}
          </div>
          <p className="text-[#58423d] text-xs font-semibold uppercase tracking-wider mb-1">Revenu total</p>
          <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} €</p>
        </div>

        <div className="bg-white border border-[#dfc0ba] p-4 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#ffb961]/20 text-[#7a4b00] rounded-lg">
              <Hourglass className="w-5 h-5" strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-[#58423d] text-xs font-semibold uppercase tracking-wider mb-1">Paiements en attente</p>
          <p className="text-2xl font-bold">{pendingTotal.toLocaleString()} €</p>
        </div>

        <div className="bg-white border border-[#dfc0ba] p-4 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[#dae1e3] text-[#586062] rounded-lg">
              <CalendarDays className="w-5 h-5" strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-[#58423d] text-xs font-semibold uppercase tracking-wider mb-1">Prochain virement</p>
          <p className="text-2xl font-bold">—</p>
          <p className="text-xs text-[#58423d] mt-1">À définir avec votre méthode de virement</p>
        </div>
      </div>

      {/* Historique des transactions */}
      <div className="bg-white border border-[#dfc0ba] rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-4 border-b border-[#dfc0ba] flex flex-col md:flex-row justify-between md:items-center gap-3 bg-[#f9f3ec]">
          <h3 className="text-xl font-bold">Historique des transactions</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Rechercher un client..."
                className="pl-9 pr-3 py-2 bg-white border border-[#dfc0ba] rounded-lg text-sm outline-none focus:border-[#9b2f1e] transition-all"
              />
            </div>
            <select
              value={statusFilter ?? ''}
              onChange={(e) => {
                setStatusFilter(e.target.value || null);
                setPage(1);
              }}
              className="px-3 py-2 border border-[#dfc0ba] rounded-lg text-sm bg-white"
            >
              <option value="">Tous les statuts</option>
              <option value="completed">Terminé</option>
              <option value="pending">En attente</option>
              <option value="cancelled">Annulé</option>
            </select>
            <button className="px-3 py-2 border border-[#dfc0ba] rounded-lg flex items-center gap-2 text-[#58423d] hover:bg-white transition-all">
              <Download className="w-4 h-4" strokeWidth={1.75} />
              Exporter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f9f3ec]/50">
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase tracking-wider">Type d'événement</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase tracking-wider">Montant</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfc0ba]/30">
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
                    Aucune transaction trouvée.
                  </td>
                </tr>
              )}
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-[#f9f3ec] transition-colors group">
                  <td className="px-4 py-4">{new Date(p.paid_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-4 font-bold">{p.client_name}</td>
                  <td className="px-4 py-4 text-[#58423d]">{p.event_type}</td>
                  <td className="px-4 py-4 font-bold">{p.amount.toLocaleString()} €</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[p.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[p.status]}`} />
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="p-1 hover:bg-[#ede7e0] rounded-full transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 bg-[#f9f3ec] border-t border-[#dfc0ba] flex items-center justify-between">
            <p className="text-[#58423d] text-sm">
              Affichage de {paginated.length} sur {filtered.length} transactions
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center border border-[#dfc0ba] rounded-lg text-[#58423d] hover:bg-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                    page === p ? 'bg-[#9b2f1e] text-white' : 'border border-[#dfc0ba] text-[#58423d] hover:bg-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-[#dfc0ba] rounded-lg text-[#58423d] hover:bg-white disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cartes complémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Méthode de virement */}
        <div className="bg-white border border-[#dfc0ba] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Méthode de virement</h4>
            <button className="text-[#9b2f1e] font-bold text-sm hover:underline">Modifier</button>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#f9f3ec] rounded-lg">
            <div className="w-12 h-8 bg-black/5 flex items-center justify-center rounded border border-[#dfc0ba] shrink-0">
              <Landmark className="w-4 h-4 text-[#58423d]" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <p className="font-bold">Aucun compte configuré</p>
              <p className="text-[#58423d] text-sm">Ajoutez vos coordonnées bancaires pour recevoir vos virements</p>
            </div>
          </div>
        </div>

        {/* Résumé fiscal indicatif */}
        <div className="bg-white border border-[#dfc0ba] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Estimation TVA</h4>
            <button className="text-[#9b2f1e] font-bold text-sm hover:underline flex items-center gap-1">
              <Download className="w-3.5 h-3.5" strokeWidth={2} />
              Exporter en PDF
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#58423d]">TVA collectée estimée (20%)</span>
              <span className="font-bold">{estimatedVAT.toLocaleString()} €</span>
            </div>
            <div className="h-px bg-[#dfc0ba]" />
            <div className="flex justify-between font-bold">
              <span>Basé sur le revenu total confirmé</span>
              <span className="text-[#9b2f1e]">{totalRevenue.toLocaleString()} €</span>
            </div>
          </div>
          <p className="text-xs text-[#8b716c] mt-3 italic">
            Estimation indicative — consultez votre comptable pour votre déclaration officielle.
          </p>
        </div>
      </div>
    </div>
  );
}