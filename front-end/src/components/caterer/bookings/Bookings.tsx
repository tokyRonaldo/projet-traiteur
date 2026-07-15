// components/caterer/bookings/Bookings.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Download,
  CalendarDays,
  Banknote,
  CheckCircle2,
  Users,
  ReceiptText,
  ImageOff,
} from 'lucide-react';
import { api } from '@/lib/api';

interface BookingItem {
  id: number;
  event_title: string;
  client: {
    name: string;
  };
  quote: {
    event_request: {
      event_date: string;
    };
  };
  guests_number: number;
  price?: number;
  status: 'confirmed' | 'cancelled'; // seul le vrai statut en base
  deposit_paid: boolean;
}

const FILTER_LABELS: Record<string, string> = {
  all: 'Tous',
  upcoming: 'À venir',
  today: "Aujourd'hui",
  completed: 'Terminé',
  cancelled: 'Annulé',
};

const FILTER_STYLES: Record<string, string> = {
  all: 'bg-[#f9f3ec] text-[#58423d]',
  upcoming: 'bg-[#9b2f1e]/10 text-[#9b2f1e]',
  today: 'bg-[#ffddb9] text-[#663e00]',
  completed: 'bg-[#dae1e3] text-[#586062]',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Bookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadBookings = () => {
    setLoading(true);
    api
      .get('caterer/bookings')
      .then((res) => setBookings(res.data ?? res))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Détermine le statut AFFICHÉ (dérivé de la date + du vrai statut "cancelled")
  function getDisplayStatus(booking: BookingItem): { key: string; label: string; style: string } {
    if (booking.status === 'cancelled') {
      return { key: 'cancelled', label: 'Annulé', style: FILTER_STYLES.cancelled };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(booking.quote?.event_request?.event_date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate.getTime() === today.getTime()) {
      return { key: 'today', label: "Aujourd'hui", style: FILTER_STYLES.today };
    }
    if (eventDate > today) {
      return { key: 'upcoming', label: 'À venir', style: FILTER_STYLES.upcoming };
    }
    return { key: 'completed', label: 'Terminé', style: FILTER_STYLES.completed };
  }

  // Filtre en fonction du statut affiché (pas du statut brut)
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const display = getDisplayStatus(b);
      const matchStatus = !statusFilter || statusFilter === 'all' || display.key === statusFilter;
      const matchSearch = b.client?.name.toLowerCase().includes(search.toLowerCase()) ?? false;
      return matchStatus && matchSearch;
    });
  }, [bookings, statusFilter, search]);

  const now = new Date();
  const thisMonthBookings = bookings.filter((b) => {
    const d = new Date(b.quote?.event_request?.event_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const stats = {
    thisMonth: thisMonthBookings.length,
    revenue: thisMonthBookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.price ?? 0), 0),
    completed: bookings.filter((b) => getDisplayStatus(b).key === 'completed').length,
    guests: thisMonthBookings.reduce((sum, b) => sum + b.guests_number, 0),
  };

  const handleToggleCancel = async (booking: BookingItem) => {
    const newStatus = booking.status === 'cancelled' ? 'confirmed' : 'cancelled';
    const confirmMsg =
      newStatus === 'cancelled' ? 'Annuler cette réservation ?' : 'Réactiver cette réservation ?';

    if (!confirm(confirmMsg)) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: newStatus } : b))
    );

    try {
      await api.put(`caterer/booking/status/${booking.id}`, { status: newStatus });
    } catch {
      loadBookings();
    }
  };

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#9b2f1e] mb-1">Réservations</h2>
          <p className="text-[#586062]">Gérez vos événements confirmés et leur logistique.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-full border-2 border-[#dfc0ba] text-[#1d1b17] font-bold hover:bg-[#f3ede6] transition-all flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
            Filtres
          </button>
          <button className="px-4 py-2 rounded-full border-2 border-[#dfc0ba] text-[#1d1b17] font-bold hover:bg-[#f3ede6] transition-all flex items-center gap-2">
            <Download className="w-4 h-4" strokeWidth={1.75} />
            Exporter le planning
          </button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#f9f3ec] border border-[#dfc0ba] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-[#9b2f1e] mb-2">
            <CalendarDays className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-xs font-semibold uppercase tracking-wider">Ce mois-ci</span>
          </div>
          <p className="text-2xl font-bold">{stats.thisMonth} événements</p>
        </div>

        <div className="bg-[#f9f3ec] border border-[#dfc0ba] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-[#7a4b00] mb-2">
            <Banknote className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-xs font-semibold uppercase tracking-wider">Revenu prévu</span>
          </div>
          <p className="text-2xl font-bold">{stats.revenue.toLocaleString()} €</p>
        </div>

        <div className="bg-[#f9f3ec] border border-[#dfc0ba] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-[#586062] mb-2">
            <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-xs font-semibold uppercase tracking-wider">Terminés</span>
          </div>
          <p className="text-2xl font-bold">{stats.completed}</p>
          <p className="text-sm text-[#586062]">Total sur l&apos;historique</p>
        </div>

        <div className="bg-[#f9f3ec] border border-[#dfc0ba] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-[#9b2f1e] mb-2">
            <Users className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-xs font-semibold uppercase tracking-wider">Invités</span>
          </div>
          <p className="text-2xl font-bold">{stats.guests}</p>
          <p className="text-sm text-[#586062]">Total ce mois-ci</p>
        </div>
      </div>

      {/* Recherche + filtres statut */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#dfc0ba] rounded-full outline-none focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'upcoming', 'today', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${
                statusFilter === s ? FILTER_STYLES[s] : 'bg-white border border-[#dfc0ba] text-[#58423d]'
              }`}
            >
              {FILTER_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-4">
          {loading && <p className="text-[#58423d]">Chargement...</p>}

          {!loading && filtered.length === 0 && (
            <div className="py-10 flex flex-col items-center text-center bg-white border border-[#dfc0ba] rounded-xl">
              <ReceiptText className="w-8 h-8 text-[#8b716c] mb-2" strokeWidth={1.5} />
              <p className="text-[#58423d]">Aucune réservation dans cette catégorie.</p>
            </div>
          )}

          {filtered.map((booking) => {
            const display = getDisplayStatus(booking);
            const isPastOrCancelled = display.key === 'completed' || display.key === 'cancelled';

            return (
              <div
                key={booking.id}
                className={`bg-white border border-[#dfc0ba] rounded-xl overflow-hidden hover:shadow-md transition-shadow group ${
                  isPastOrCancelled ? 'opacity-75' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-40 h-32 md:h-auto bg-[#f3ede6] flex items-center justify-center shrink-0">
                    <ImageOff className="w-6 h-6 text-[#8b716c]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${display.style}`}>
                          {display.label}
                        </span>
                        <h4 className="text-lg font-bold mt-2">{booking.event_title}</h4>
                        <p className="text-[#586062]">Client : {booking.client?.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block font-bold text-lg text-[#9b2f1e]">
                          {booking.price?.toLocaleString() ?? '—'} €
                        </span>
                        <span className="text-xs text-[#58423d]">Prix final</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#dfc0ba] pt-3">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#58423d] tracking-wider">Date</span>
                        <span className="font-bold text-sm">
                          {new Date(booking.quote?.event_request?.event_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#58423d] tracking-wider">Invités</span>
                        <span className="font-bold text-sm">{booking.guests_number} pers.</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-[#58423d] tracking-wider">Acompte</span>
                        <span className={`font-bold text-sm ${booking.deposit_paid ? 'text-green-700' : 'text-amber-700'}`}>
                          {booking.deposit_paid ? 'Payé' : 'En attente'}
                        </span>
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleToggleCancel(booking)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                            booking.status === 'cancelled'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {booking.status === 'cancelled' ? 'Réactiver' : 'Annuler'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}