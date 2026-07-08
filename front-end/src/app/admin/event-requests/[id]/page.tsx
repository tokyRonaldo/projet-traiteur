// app/admin/event-requests/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Badge from '@/components/admin/Badge';

export default function EventRequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    api.get(`admin/event-request/show/${id}`).then(setRequest);
  }, [id]);

  if (!request) return <p>Chargement...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Demande #{request.id}</h1>

      <div className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
        <p><strong>Client :</strong> {request.client?.name} ({request.client?.email})</p>
        <p><strong>Traiteur :</strong> {request.caterer?.company_name}</p>
        <p><strong>Type d'événement :</strong> {request.event_type}</p>
        <p><strong>Date :</strong> {new Date(request.event_date).toLocaleDateString()}</p>
        <p><strong>Nombre d'invités :</strong> {request.guests_number}</p>
        <p><strong>Budget :</strong> {request.budget} €</p>
        <p><strong>Message :</strong> {request.message}</p>
        <p><strong>Statut :</strong> <Badge status={request.status} /></p>
      </div>

      {request.quotes?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Devis liés</h2>
          <ul className="space-y-2 text-sm">
            {request.quotes.map((q: any) => (
              <li key={q.id} className="flex justify-between border-b pb-2">
                <span>{q.proposed_price} €</span>
                <Badge status={q.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}