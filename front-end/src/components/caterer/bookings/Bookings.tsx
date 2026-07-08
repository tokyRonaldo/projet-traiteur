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
  ArrowRight,
  ReceiptText,
  ImageOff,
} from 'lucide-react';
import { api } from '@/lib/api';

interface BookingItem {
  id: number;
  event_title: string;
  client_name: string;
  event_date: string;
  guests_number: number;
  final_price: number;
  status: 'upcoming' | 'prep' | 'completed';
  deposit_paid: boolean;
}

interface ChecklistTask {
  id: number;
  label: string;
  sublabel: string;
  done: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  upcoming: 'À venir',
  prep: 'En préparation',
  completed: 'Terminé',
};

const STATUS_STYLES: Record<string, string> = {
  upcoming: 'bg-[#9b2f1e]/10 text-[#9b2f1e]',
  prep: 'bg-[#ffddb9] text-[#663e00]',
  completed: 'bg-[#dae1e3] text-[#586062]',
};

export default function Bookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [checklist, setChecklist] = useState<ChecklistTask[]>([
    { id: 1, label: 'Finaliser le menu du 24 oct.', sublabel: 'Mariage Sarah & Michael', done: true },
    { id: 2, label: 'Briefing équipe (8 personnes)', sublabel: 'Échéance dans 2 jours', done: false },
    { id: 3, label: 'Commander safran bio (200g)', sublabel: 'Demande spéciale fournisseur', done: false },
    { id: 4, label: 'Visite du lieu (Le Manoir)', sublabel: 'Prévu demain 10h', done: false },
  ]);

  useEffect(() => {
    setLoading(true);
    api
      .get('caterer/bookings') // adapte à ta vraie route
      .then((res) => setBookings(res.data ?? res))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = !statusFilter || b.status === statusFilter;
      const matchSearch = b.client_name.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [bookings, statusFilter, search]);

  const toggleTask = (id: number) => {
    setChecklist((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const now = new Date();
  const thisMonthBookings = bookings.filter((b) => {
    const d = new Date(b.event_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const stats = {
    thisMonth: thisMonthBookings.length,
    revenue: thisMonthBookings.reduce((sum, b) => sum + b.final_price, 0),
    completed: bookings.filter((b) => b.status === 'completed').length,
    guests: thisMonthBookings.reduce((sum, b) => sum + b.guests_number, 0),
  };

  const completedTasks = checklist.filter((t) => t.done).length;
  const workload = checklist.length > 0 ? Math.round((completedTasks / checklist.length) * 100) : 0;

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
          <p className="text-sm text-[#586062]">Total sur l'historique</p>
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
        <div className="flex gap-2">
          {['upcoming', 'prep', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${
                statusFilter === s ? STATUS_STYLES[s] : 'bg-white border border-[#dfc0ba] text-[#58423d]'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Disposition principale */}
      <div className="grid grid-cols-12 gap-6">
        {/* Liste des réservations */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {loading && <p className="text-[#58423d]">Chargement...</p>}

          {!loading && filtered.length === 0 && (
            <div className="py-10 flex flex-col items-center text-center bg-white border border-[#dfc0ba] rounded-xl">
              <ReceiptText className="w-8 h-8 text-[#8b716c] mb-2" strokeWidth={1.5} />
              <p className="text-[#58423d]">Aucune réservation dans cette catégorie.</p>
            </div>
          )}

          {filtered.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white border border-[#dfc0ba] rounded-xl overflow-hidden hover:shadow-md transition-shadow group ${
                booking.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-40 h-32 md:h-auto bg-[#f3ede6] flex items-center justify-center shrink-0">
                  <ImageOff className="w-6 h-6 text-[#8b716c]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${STATUS_STYLES[booking.status]}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                      <h4 className="text-lg font-bold mt-2">{booking.event_title}</h4>
                      <p className="text-[#586062]">Client : {booking.client_name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-bold text-lg text-[#9b2f1e]">
                        {booking.final_price.toLocaleString()} €
                      </span>
                      <span className="text-xs text-[#58423d]">Prix final</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#dfc0ba] pt-3">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#58423d] tracking-wider">Date</span>
                      <span className="font-bold text-sm">
                        {new Date(booking.event_date).toLocaleDateString('fr-FR')}
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
                      <button className="bg-[#f3ede6] text-[#9b2f1e] p-2 rounded-full hover:bg-[#9b2f1e] hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Panneau logistique */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-[#ede7e0] p-4 rounded-xl border border-[#dfc0ba] h-full">
            <h3 className="text-lg font-bold text-[#9b2f1e] mb-4">Checklist de préparation</h3>

            <div className="space-y-4">
              {checklist.map((task) => (
                <label key={task.id} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 rounded border-[#dfc0ba] text-[#9b2f1e] focus:ring-[#9b2f1e] h-5 w-5"
                  />
                  <div>
                    <p className={`font-bold ${task.done ? 'line-through text-[#8b716c]' : 'text-[#1d1b17]'}`}>
                      {task.label}
                    </p>
                    <p className="text-xs text-[#586062]">{task.sublabel}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#dfc0ba]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#58423d]">
                  Avancement de la préparation
                </span>
                <span className="text-xs font-bold text-[#9b2f1e]">{workload}%</span>
              </div>
              <div className="w-full h-2 bg-[#e7e2db] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#9b2f1e] rounded-full transition-all"
                  style={{ width: `${workload}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}