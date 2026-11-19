// components/caterer/bookings/Bookings.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Download,
  CalendarDays,
  Banknote,
  CheckCircle2,
  Users,
  ReceiptText,
  ImageOff,
} from 'lucide-react';
import { api } from '@/lib/api';
import { exportCsv } from '@/lib/exportCsv';
import FilterPopover, { FilterField, filterInputClass } from '@/components/shared/FilterPopover';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface BookingItem {
  id: number;
  title?: string;
  event_title?: string;
  event_date?: string | null;
  client: { name: string } | null;
  quote: { event_request: { event_date: string } } | null;
  guests_number: number | null;
  price?: number | string | null;
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

/* ---------- helpers de dates (comparaison par jour, sans décalage de fuseau) ---------- */
const pad = (n: number) => String(n).padStart(2, '0');
const localKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function dayKey(value?: string | null): string {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : localKey(d);
}

const eventDateOf = (b: BookingItem) => b.event_date ?? b.quote?.event_request?.event_date ?? null;
const titleOf = (b: BookingItem) => b.title ?? b.event_title ?? 'Réservation';

const fmtDate = (value?: string | null) => {
  const key = dayKey(value);
  return key ? new Date(`${key}T00:00:00`).toLocaleDateString('fr-FR') : '—';
};

const fmtMoney = (value?: number | string | null) =>
  value === null || value === undefined || value === '' ? '—' : `${Number(value).toLocaleString('fr-FR')} €`;

// Statut AFFICHÉ : dérivé de la date + du vrai statut "cancelled"
function getDisplayStatus(b: BookingItem): { key: string; label: string; style: string } {
  if (b.status === 'cancelled') {
    return { key: 'cancelled', label: 'Annulé', style: FILTER_STYLES.cancelled };
  }

  const key = dayKey(eventDateOf(b));
  const today = localKey(new Date());

  if (key === today) return { key: 'today', label: "Aujourd'hui", style: FILTER_STYLES.today };
  if (!key || key > today) return { key: 'upcoming', label: 'À venir', style: FILTER_STYLES.upcoming };
  return { key: 'completed', label: 'Terminé', style: FILTER_STYLES.completed };
}

export default function Bookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Filtres avancés
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentFilter, setPaymentFilter] = useState(''); // '' | 'deposit_paid' | 'unpaid'

  // Modal annuler / réactiver
  const [toggleTarget, setToggleTarget] = useState<BookingItem | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

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

  const activeFilters = [dateFrom, dateTo, paymentFilter].filter(Boolean).length;

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setPaymentFilter('');
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const display = getDisplayStatus(b);
      const matchStatus = !statusFilter || statusFilter === 'all' || display.key === statusFilter;
      const matchSearch = (b.client?.name ?? '').toLowerCase().includes(search.toLowerCase());

      const day = dayKey(eventDateOf(b));
      const matchDate = (!dateFrom || day >= dateFrom) && (!dateTo || day <= dateTo);

      const matchPayment =
        !paymentFilter || (paymentFilter === 'deposit_paid' ? b.deposit_paid : !b.deposit_paid);

      return matchStatus && matchSearch && matchDate && matchPayment;
    });
  }, [bookings, statusFilter, search, dateFrom, dateTo, paymentFilter]);

  const monthKey = localKey(new Date()).slice(0, 7);
  const thisMonthBookings = bookings.filter((b) => dayKey(eventDateOf(b)).slice(0, 7) === monthKey);

  const stats = {
    thisMonth: thisMonthBookings.length,
    revenue: thisMonthBookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.price ?? 0), 0),
    completed: bookings.filter((b) => getDisplayStatus(b).key === 'completed').length,
    guests: thisMonthBookings.reduce((sum, b) => sum + Number(b.guests_number ?? 0), 0),
  };

  /* ---------- annulation / réactivation ---------- */
  const closeToggle = () => {
    if (toggleLoading) return;
    setToggleTarget(null);
    setToggleError(null);
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    const newStatus: BookingItem['status'] = toggleTarget.status === 'cancelled' ? 'confirmed' : 'cancelled';

    setToggleLoading(true);
    setToggleError(null);
    try {
      await api.put(`caterer/booking/status/${toggleTarget.id}`, { status: newStatus });
      setBookings((prev) => prev.map((b) => (b.id === toggleTarget.id ? { ...b, status: newStatus } : b)));
      setToggleTarget(null);
    } catch (err: any) {
      setToggleError(err.message || 'Impossible de modifier cette réservation.');
    } finally {
      setToggleLoading(false);
    }
  };

  /* ---------- export ---------- */
  const handleExport = () => {
    const sorted = [...filtered].sort((a, b) => dayKey(eventDateOf(a)).localeCompare(dayKey(eventDateOf(b))));
    exportCsv(
      `planning-${localKey(new Date())}.csv`,
      ['Date', 'Événement', 'Client', 'Invités', 'Prix (€)', 'Acompte', 'Statut'],
      sorted.map((b) => [
        fmtDate(eventDateOf(b)),
        titleOf(b),
        b.client?.name,
        b.guests_number,
        b.price === null || b.price === undefined ? '' : Number(b.price),
        b.deposit_paid ? 'Payé' : 'En attente',
        getDisplayStatus(b).label,
      ])
    );
  };

  const isReactivating = toggleTarget?.status === 'cancelled';

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#9b2f1e] mb-1">Réservations</h2>
          <p className="text-[#586062]">Gérez vos événements confirmés et leur logistique.</p>
        </div>
        <div className="flex gap-2">
          <FilterPopover activeCount={activeFilters} onReset={resetFilters}>
            <FilterField label="Événement à partir du">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={filterInputClass}
              />
            </FilterField>
            <FilterField label="Événement jusqu'au">
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className={filterInputClass}
              />
            </FilterField>
            <FilterField label="Acompte">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className={filterInputClass}
              >
                <option value="">Tous</option>
                <option value="deposit_paid">Acompte payé</option>
                <option value="unpaid">Acompte en attente</option>
              </select>
            </FilterField>
          </FilterPopover>

          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="px-4 py-2 rounded-lg border border-[#dfc0ba] bg-white text-[#58423d] font-semibold text-sm hover:bg-[#f9f3ec] transition-all flex items-center gap-2 disabled:opacity-40"
          >
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
          <p className="text-2xl font-bold">{stats.revenue.toLocaleString('fr-FR')} €</p>
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
      <div className="space-y-4">
        {loading && <p className="text-[#58423d]">Chargement...</p>}

        {!loading && filtered.length === 0 && (
          <div className="py-10 flex flex-col items-center text-center bg-white border border-[#dfc0ba] rounded-xl">
            <ReceiptText className="w-8 h-8 text-[#8b716c] mb-2" strokeWidth={1.5} />
            <p className="text-[#58423d]">
              {activeFilters > 0 || search || statusFilter
                ? 'Aucune réservation ne correspond à ces critères.'
                : "Vous n'avez pas encore de réservation."}
            </p>
          </div>
        )}

        {filtered.map((booking) => {
          const display = getDisplayStatus(booking);
          const isPastOrCancelled = display.key === 'completed' || display.key === 'cancelled';

          return (
            <div
              key={booking.id}
              className={`bg-white border border-[#dfc0ba] rounded-xl overflow-hidden hover:shadow-md transition-shadow ${
                isPastOrCancelled ? 'opacity-75' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-40 h-32 md:h-auto bg-[#f3ede6] flex items-center justify-center shrink-0">
                  <ImageOff className="w-6 h-6 text-[#8b716c]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${display.style}`}
                      >
                        {display.label}
                      </span>
                      <h4 className="text-lg font-bold mt-2">{titleOf(booking)}</h4>
                      <p className="text-[#586062]">Client : {booking.client?.name ?? '—'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-bold text-lg text-[#9b2f1e]">{fmtMoney(booking.price)}</span>
                      <span className="text-xs text-[#58423d]">Prix final</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#dfc0ba] pt-3">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#58423d] tracking-wider">Date</span>
                      <span className="font-bold text-sm">{fmtDate(eventDateOf(booking))}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#58423d] tracking-wider">
                        Invités
                      </span>
                      <span className="font-bold text-sm">{booking.guests_number ?? '—'} pers.</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#58423d] tracking-wider">
                        Acompte
                      </span>
                      <span
                        className={`font-bold text-sm ${booking.deposit_paid ? 'text-green-700' : 'text-amber-700'}`}
                      >
                        {booking.deposit_paid ? 'Payé' : 'En attente'}
                      </span>
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setToggleTarget(booking)}
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

      {toggleTarget && (
        <ConfirmModal
          title={isReactivating ? 'Réactiver cette réservation ?' : 'Annuler cette réservation ?'}
          message={
            isReactivating ? (
              <>
                La réservation <strong>{titleOf(toggleTarget)}</strong> de {toggleTarget.client?.name ?? 'ce client'}{' '}
                sera de nouveau confirmée.
              </>
            ) : (
              <>
                La réservation <strong>{titleOf(toggleTarget)}</strong> de {toggleTarget.client?.name ?? 'ce client'}{' '}
                sera marquée comme annulée. Vous pourrez la réactiver depuis cette page.
              </>
            )
          }
          confirmLabel={isReactivating ? 'Réactiver' : 'Annuler la réservation'}
          variant={isReactivating ? 'primary' : 'danger'}
          loading={toggleLoading}
          error={toggleError}
          onConfirm={handleConfirmToggle}
          onCancel={closeToggle}
        />
      )}
    </div>
  );
}