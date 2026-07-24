// components/client/bookings/Bookings.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, MapPin, ImageOff } from 'lucide-react';
import { api } from '@/lib/api';

interface BookingItem {
  id: number;
  title: string;
  event_date: string;
  guests_number: number;
  price: number;
  status: 'confirmed' | 'cancelled';
  caterer: { id: number; company_name: string; location: string };
}

export default function Bookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    api
      .get('client/bookings')
      .then((res) => setBookings(res.data ?? res))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    return bookings.filter((b) => {
      if (filter === 'upcoming') return new Date(b.event_date) >= now && b.status !== 'cancelled';
      if (filter === 'past') return new Date(b.event_date) < now || b.status === 'cancelled';
      return true;
    });
  }, [bookings, filter]);

  const nextBooking = bookings
    .filter((b) => new Date(b.event_date) >= new Date() && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())[0];

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1d1b17]">Mes réservations</h2>
          <p className="text-[#58423d]">Suivez vos événements confirmés et passés.</p>
        </div>
        <div className="flex bg-[#f3ede6] rounded-lg p-1">
          {(['all', 'upcoming', 'past'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                filter === f ? 'bg-white text-[#9b2f1e] shadow-sm' : 'text-[#58423d]'
              }`}
            >
              {f === 'all' ? 'Toutes' : f === 'upcoming' ? 'À venir' : 'Passées'}
            </button>
          ))}
        </div>
      </div>

      {nextBooking && filter === 'all' && (
        <div className="bg-[#9b2f1e] text-white rounded-xl p-6 mb-6">
          <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2 uppercase">
            Prochain événement
          </span>
          <h3 className="text-2xl font-bold mb-2">{nextBooking.title}</h3>
          <p className="opacity-90">
            {new Date(nextBooking.event_date).toLocaleDateString('fr-FR', {
              weekday: 'long', day: 'numeric', month: 'long',
            })} — {nextBooking.caterer.company_name}
          </p>
        </div>
      )}

      {loading && <p className="text-[#58423d]">Chargement...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-[#58423d] bg-white border border-[#dfc0ba] rounded-xl p-8 text-center">
          Aucune réservation dans cette catégorie.
        </p>
      )}

      <div className="space-y-3">
        {filtered.map((b) => (
          <Link
            key={b.id}
            href={`/client/bookings/${b.id}`}
            className="flex items-center gap-4 bg-white border border-[#dfc0ba] rounded-xl p-4 hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 rounded-lg bg-[#f3ede6] flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#58423d]">
                {new Date(b.event_date).toLocaleDateString('fr-FR', { month: 'short' })}
              </span>
              <span className="text-lg font-bold text-[#9b2f1e]">
                {new Date(b.event_date).getDate()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-bold">{b.title}</p>
              <p className="text-sm text-[#58423d] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} /> {b.caterer.company_name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#9b2f1e]">{Number(b.price).toLocaleString()} €</p>
              <span
                className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                  b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-[#ffdad4] text-[#9b2f1e]'
                }`}
              >
                {b.status === 'cancelled' ? 'Annulé' : 'Confirmé'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}