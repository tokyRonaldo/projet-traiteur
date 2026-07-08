// app/admin/quotes/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Badge from '@/components/admin/Badge';

export default function QuoteDetailPage() {
  const { id } = useParams();
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    api.get(`admin/quote/show/${id}`).then(setQuote);
  }, [id]);

  if (!quote) return <p>Chargement...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Devis #{quote.id}</h1>

      <div className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
        <p><strong>Client :</strong> {quote.event_request?.client?.name}</p>
        <p><strong>Traiteur :</strong> {quote.caterer?.company_name}</p>
        <p><strong>Prix proposé :</strong> {quote.proposed_price} €</p>
        <p><strong>Message :</strong> {quote.message}</p>
        <p><strong>Statut :</strong> <Badge status={quote.status} /></p>
        <p><strong>Envoyé le :</strong> {new Date(quote.sent_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}