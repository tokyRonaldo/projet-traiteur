// components/caterer/calendar/Calendar.tsx
'use client';

import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Ban,
  Clock,
  ArrowRight,
  Lock,
  Plane,
} from 'lucide-react';

interface CalendarEvent {
  date: string; // format YYYY-MM-DD
  label: string;
  type: 'booking' | 'prep' | 'blocked' | 'vacation';
}

// Exemple — à remplacer par un vrai fetch (GET /caterer/availability)
const MOCK_EVENTS: CalendarEvent[] = [
  { date: '2026-07-02', label: 'Dégustation - Miller', type: 'booking' },
  { date: '2026-07-06', label: 'Déjeuner entreprise (40p)', type: 'booking' },
  { date: '2026-07-06', label: 'Préparation: Gala', type: 'prep' },
  { date: '2026-07-07', label: 'Gala Soirée (120p)', type: 'booking' },
  { date: '2026-07-11', label: 'Congés', type: 'vacation' },
  { date: '2026-07-12', label: 'Congés', type: 'vacation' },
];

const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month');
  const [events] = useState<CalendarEvent[]>(MOCK_EVENTS);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = useMemo(() => {
    const result: { day: number; currentMonth: boolean; dateKey: string }[] = [];

    // Jours du mois précédent (grisés)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      result.push({ day, currentMonth: false, dateKey: '' });
    }
    // Jours du mois en cours
    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ day, currentMonth: true, dateKey: formatDateKey(year, month, day) });
    }
    // Compléter jusqu'à un multiple de 7
    while (result.length % 7 !== 0) {
      const day = result.length - (firstDayOfWeek + daysInMonth) + 1;
      result.push({ day, currentMonth: false, dateKey: '' });
    }
    return result;
  }, [year, month, firstDayOfWeek, daysInMonth, daysInPrevMonth]);

  const isToday = (dateKey: string) =>
    dateKey === formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const eventsForDay = (dateKey: string) => events.filter((e) => e.date === dateKey);

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleBlockDates = () => {
    // À terme : ouvrir un vrai modal avec sélection de plage de dates
    const reason = prompt('Raison du blocage (ex: congés, maintenance) :');
    if (reason) {
      // TODO: appel API POST /caterer/availability/block
      alert(`Période bloquée : ${reason}`);
    }
  };

  const eventTypeStyles: Record<CalendarEvent['type'], string> = {
    booking: 'bg-[#bc4733] text-white',
    prep: 'bg-[#9b2f1e] text-white',
    blocked: 'bg-[#7a4b00]/10 text-[#7a4b00] border border-[#ffb961]',
    vacation: 'bg-[#e7e2db] text-[#58423d]',
  };

  const upcomingEvents = events
    .filter((e) => e.date >= formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()))
    .slice(0, 3);

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <nav className="flex mb-1 text-[#58423d] text-xs font-semibold">
            <span className="hover:text-[#9b2f1e] cursor-pointer">Saffron Hearth</span>
            <span className="mx-2">/</span>
            <span className="text-[#9b2f1e]">Calendrier</span>
          </nav>
          <h2 className="text-3xl font-bold text-[#1d1b17]">
            {MONTH_NAMES[month]} {year}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white border border-[#dfc0ba] rounded-lg flex p-1">
            {(['month', 'week', 'agenda'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                  view === v
                    ? 'bg-[#bc4733]/20 text-[#872111]'
                    : 'text-[#58423d] hover:bg-[#ede7e0]'
                }`}
              >
                {v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : 'Agenda'}
              </button>
            ))}
          </div>
          <button
            onClick={goToPrevMonth}
            className="bg-white border border-[#dfc0ba] p-2 rounded-lg hover:bg-[#ede7e0] transition-all"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <button
            onClick={goToNextMonth}
            className="bg-white border border-[#dfc0ba] p-2 rounded-lg hover:bg-[#ede7e0] transition-all"
            aria-label="Mois suivant"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <button
            onClick={handleBlockDates}
            className="bg-[#9b2f1e] text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1 hover:shadow-md transition-all active:scale-95"
          >
            <Ban className="w-4 h-4" strokeWidth={1.75} />
            Bloquer des dates
          </button>
        </div>
      </div>

      {view !== 'month' && (
        <p className="text-sm text-[#58423d] mb-4 italic">
          La vue « {view === 'week' ? 'Semaine' : 'Agenda'} » arrive bientôt — affichage du mois pour le moment.
        </p>
      )}

      {/* Disposition principale */}
      <div className="grid grid-cols-12 gap-6">
        {/* Calendrier */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-xl border border-[#dfc0ba] shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 bg-[#f9f3ec] border-b border-[#dfc0ba]">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-3 text-center text-xs font-semibold text-[#58423d] uppercase tracking-widest">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map((cell, i) => {
                const dayEvents = cell.currentMonth ? eventsForDay(cell.dateKey) : [];
                const todayCell = cell.currentMonth && isToday(cell.dateKey);
                const vacationDay = dayEvents.some((e) => e.type === 'vacation');

                return (
                  <div
                    key={i}
                    className={`min-h-[110px] p-2 border-r border-b border-[#dfc0ba] transition-colors ${
                      !cell.currentMonth
                        ? 'bg-[#e7e2db]/20 text-[#8b716c] opacity-40'
                        : vacationDay
                        ? 'bg-[#e7e2db]'
                        : todayCell
                        ? 'bg-[#bc4733]/5 border-2 border-[#9b2f1e]'
                        : 'hover:bg-[#f9f3ec] cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm ${todayCell ? 'font-bold text-[#9b2f1e]' : 'font-medium'}`}>
                        {cell.day}
                      </span>
                      {todayCell && <span className="w-2 h-2 rounded-full bg-[#9b2f1e] animate-pulse" />}
                      {vacationDay && <Plane className="w-4 h-4 text-[#8b716c]" strokeWidth={1.75} />}
                    </div>
                    {todayCell && <p className="text-[10px] mt-1 font-bold text-[#9b2f1e]">Aujourd'hui</p>}

                    <div className="mt-1 space-y-1">
                      {dayEvents
                        .filter((e) => e.type !== 'vacation')
                        .map((e, idx) => (
                          <div
                            key={idx}
                            className={`text-[10px] p-1 rounded font-bold truncate ${eventTypeStyles[e.type]}`}
                          >
                            {e.label}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panneau latéral */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Charge mensuelle */}
          <div className="bg-white p-4 rounded-xl border border-[#dfc0ba] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#58423d] uppercase tracking-widest">Charge du mois</p>
              <h3 className="text-2xl font-bold text-[#9b2f1e]">68%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#ffb961]/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#7a4b00]" strokeWidth={1.75} />
            </div>
          </div>

          {/* Horaires habituels */}
          <div className="bg-[#f9f3ec] p-4 rounded-xl border border-[#dfc0ba]">
            <h4 className="font-bold text-[#1d1b17] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#9b2f1e]" strokeWidth={1.75} />
              Horaires habituels
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#58423d]">Lun - Ven</span>
                <span className="font-bold">08:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#58423d]">Samedi</span>
                <span className="font-bold">10:00 - 22:00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#58423d]">Dimanche</span>
                <span className="text-red-600 font-bold">Fermé</span>
              </div>
            </div>
            <button className="w-full mt-4 text-[#9b2f1e] text-sm font-bold flex items-center justify-center gap-1 hover:underline">
              Modifier les horaires <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* Prochains événements */}
          <div className="bg-white p-4 rounded-xl border border-[#dfc0ba] shadow-sm">
            <h4 className="font-bold text-[#1d1b17] mb-3">Prochains événements</h4>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-[#58423d]">Aucun événement à venir.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((e, idx) => (
                  <div key={idx} className="flex gap-2 group cursor-pointer">
                    <div className="w-1 h-12 bg-[#9b2f1e] rounded-full shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#9b2f1e]">
                        {new Date(e.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-sm font-bold leading-tight group-hover:text-[#9b2f1e] transition-colors">
                        {e.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blocage rapide */}
          <div className="rounded-xl bg-[#bc4733] p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold mb-1">Besoin d'une pause ?</h4>
              <p className="text-xs mb-3 opacity-90">
                Bloquez un week-end ou une période pour maintenance ou congés.
              </p>
              <button
                onClick={handleBlockDates}
                className="bg-white text-[#9b2f1e] px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-[#f9f3ec] transition-all"
              >
                Gérer les blocages
              </button>
            </div>
            <Lock className="absolute -bottom-2 -right-2 w-24 h-24 opacity-10" strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
}