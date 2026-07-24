// components/client/requests/Requests.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { api } from '@/lib/api';

interface RequestItem {
  id: number;
  event_type: string;
  event_date: string;
  guests_number: number;
  budget: number;
  status: 'pending' | 'responded' | 'accepted' | 'rejected';
  caterer: { company_name: string } | null;
  quotes: any[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  responded: 'Devis reçu',
  accepted: 'Confirmé',
  rejected: 'Refusé',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#e7e2db] text-[#58423d]',
  responded: 'bg-[#ffdad4] text-[#9b2f1e]',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function Requests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get('client/event-requests')
      .then((res) => setRequests(res.data ?? res))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((r) => r.event_type.toLowerCase().includes(search.toLowerCase()));
  }, [requests, search]);

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    responded: requests.filter((r) => r.status === 'responded').length,
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1d1b17]">Mes demandes</h2>
          <p className="text-[#58423d]">Suivez vos demandes envoyées aux traiteurs.</p>
        </div>
        <Link
          href="/client/requests/new"
          className="px-6 py-2 bg-[#9b2f1e] text-white rounded-full font-semibold hover:bg-[#872111] transition-colors"
        >
          Nouvelle demande
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#dfc0ba] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#58423d] uppercase">Total</p>
          <p className="text-2xl font-bold">{counts.total}</p>
        </div>
        <div className="bg-white border border-[#dfc0ba] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#58423d] uppercase">En attente</p>
          <p className="text-2xl font-bold">{counts.pending}</p>
        </div>
        <div className="bg-white border border-[#dfc0ba] rounded-xl p-4">
          <p className="text-xs font-semibold text-[#58423d] uppercase">Devis reçus</p>
          <p className="text-2xl font-bold">{counts.responded}</p>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un type d'événement..."
        className="w-full max-w-md mb-4 border border-[#dfc0ba] rounded-full px-4 py-2 text-sm bg-white"
      />

      <div className="bg-white border border-[#dfc0ba] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f9f3ec]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Événement</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Traiteur</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Budget</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#58423d] uppercase">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfc0ba]/50">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-[#58423d]">Chargement...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-[#58423d]">Aucune demande.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-[#f9f3ec] transition-colors">
                <td className="px-4 py-4 font-semibold">{r.event_type}</td>
                <td className="px-4 py-4">{new Date(r.event_date).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-4">{r.caterer?.company_name ?? '—'}</td>
                <td className="px-4 py-4">{r.budget ? `${r.budget.toLocaleString()} €` : '—'}</td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Link href={`/client/requests/${r.id}`} className="text-[#9b2f1e] hover:underline flex items-center gap-1 justify-end text-sm">
                    <Eye className="w-4 h-4" strokeWidth={1.75} /> Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}