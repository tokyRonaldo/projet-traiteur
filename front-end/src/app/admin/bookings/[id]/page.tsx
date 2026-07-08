// app/admin/bookings/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Badge from '@/components/admin/Badge';

export default function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    api.get(`admin/booking/show/${id}`).then(setBooking);
  }, [id]);

  if (!booking) return <p>Chargement...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Réservation #{booking.id}</h1>

      <div className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
        <p><strong>Client :</strong> {booking.client?.name} ({booking.client?.email})</p>
        <p><strong>Traiteur :</strong> {booking.caterer?.company_name}</p>
        <p><strong>Type d'événement :</strong> {booking.event_type}</p>
        <p><strong>Date :</strong> {new Date(booking.event_date).toLocaleDateString()}</p>
        <p><strong>Invités :</strong> {booking.guests_number}</p>
        <p><strong>Prix :</strong> {booking.budget} €</p>
        <p><strong>Statut :</strong> <Badge status={booking.status} /></p>
      </div>

      {booking.quotes?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Devis associé</h2>
          <ul className="text-sm space-y-2">
            {booking.quotes.map((q: any) => (
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