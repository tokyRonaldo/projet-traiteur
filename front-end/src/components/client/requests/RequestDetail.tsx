// components/client/requests/RequestDetail.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Users, Banknote, MapPin } from 'lucide-react';
import { api } from '@/lib/api';

interface QuoteData {
  id: number;
  proposed_price: number | string;
  message: string | null;
  status: 'sent' | 'accepted' | 'rejected';
  rejection_reason: string | null;
}

interface RequestData {
  id: number;
  event_type: string;
  event_date: string;
  guests_number: number | null;
  budget: number | string | null;
  message: string | null;
  status: 'pending' | 'responded' | 'accepted' | 'rejected';
  created_at: string;
  caterer: { id: number; company_name: string; location: string } | null;
  quotes: QuoteData[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  responded: 'Devis reçu',
  accepted: 'Confirmée',
  rejected: 'Refusée',
};
const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#e7e2db] text-[#58423d]',
  responded: 'bg-[#ffdad4] text-[#9b2f1e]',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};
const QUOTE_LABELS: Record<string, string> = {
  sent: 'En attente de votre réponse',
  accepted: 'Accepté',
  rejected: 'Refusé',
};

const fmt = (n: number | string) => `${Number(n).toLocaleString('fr-FR')} €`;

export default function RequestDetail({ requestId }: { requestId: string }) {
  const [data, setData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`client/event-request/show/${requestId}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [requestId]);

  const back = (
    <Link href="/client/requests" className="inline-flex items-center gap-2 text-[#9b2f1e] font-semibold text-sm mb-4 hover:underline">
      <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Retour à mes demandes
    </Link>
  );

  if (loading) return <p className="text-[#58423d]">Chargement...</p>;
  if (!data) return <div>{back}<p className="text-[#58423d]">Demande introuvable.</p></div>;

  return (
    <div className="max-w-3xl">
      {back}

      <div className="bg-white border border-[#dfc0ba] rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[data.status]}`}>
              {STATUS_LABELS[data.status]}
            </span>
            <h1 className="text-2xl font-bold mt-2">{data.event_type}</h1>
            <p className="text-xs text-[#8b716c]">
              Envoyée le {new Date(data.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#dfc0ba] pt-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#9b2f1e]" strokeWidth={1.75} />
            <div>
              <p className="text-[10px] uppercase font-bold text-[#58423d]">Date</p>
              <p className="font-semibold text-sm">{new Date(data.event_date).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#9b2f1e]" strokeWidth={1.75} />
            <div>
              <p className="text-[10px] uppercase font-bold text-[#58423d]">Invités</p>
              <p className="font-semibold text-sm">{data.guests_number ?? '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-[#9b2f1e]" strokeWidth={1.75} />
            <div>
              <p className="text-[10px] uppercase font-bold text-[#58423d]">Budget</p>
              <p className="font-semibold text-sm">{data.budget ? fmt(data.budget) : '—'}</p>
            </div>
          </div>
        </div>

        {data.message && (
          <div className="mt-4 bg-[#f3ede6] border-l-4 border-[#7a4b00] rounded-lg p-4">
            <p className="text-xs font-bold uppercase text-[#58423d] mb-1">Votre message</p>
            <p className="text-sm italic">{data.message}</p>
          </div>
        )}
      </div>

      {data.caterer && (
        <Link
          href={`/client/caterers/${data.caterer.id}`}
          className="flex items-center gap-3 bg-white border border-[#dfc0ba] rounded-xl p-4 mb-6 hover:shadow-md transition-all"
        >
          <MapPin className="w-5 h-5 text-[#9b2f1e]" strokeWidth={1.75} />
          <div>
            <p className="font-bold">{data.caterer.company_name}</p>
            <p className="text-sm text-[#58423d]">{data.caterer.location}</p>
          </div>
        </Link>
      )}

      <h2 className="text-lg font-bold mb-3">Devis reçus</h2>
      {data.quotes.length === 0 ? (
        <p className="text-[#58423d] bg-white border border-[#dfc0ba] rounded-xl p-6 text-center">
          Le traiteur n&apos;a pas encore répondu à cette demande.
        </p>
      ) : (
        <div className="space-y-3">
          {data.quotes.map((q) => (
            <div key={q.id} className="bg-white border border-[#dfc0ba] rounded-xl p-4">
              <div className="flex justify-between items-start gap-4">
                <p className="text-xl font-bold text-[#9b2f1e]">{fmt(q.proposed_price)}</p>
                <span className="text-xs font-bold uppercase text-[#58423d]">{QUOTE_LABELS[q.status]}</span>
              </div>
              {q.message && <p className="text-sm text-[#58423d] mt-2">{q.message}</p>}
              {q.rejection_reason && <p className="text-xs italic text-[#8b716c] mt-2">&quot;{q.rejection_reason}&quot;</p>}
              <Link
                href={q.status === 'accepted' ? '/client/bookings' : '/client/quotes'}
                className="inline-block mt-3 text-sm font-semibold text-[#9b2f1e] hover:underline"
              >
                {q.status === 'accepted' ? 'Voir la réservation' : 'Répondre dans mes devis'}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}