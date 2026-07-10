// components/caterer/calendar/Calendar.tsx
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Ban,
  Clock,
  ArrowRight,
  Lock,
  Plane,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';

interface CalendarEvent {
  date: string;
  label: string;
  type: 'booking' | 'prep' | 'blocked' | 'vacation';
}

interface WorkingHourItem {
  id?: number;
  day_of_week: number; // 1 = Lundi ... 7 = Dimanche
  is_open: boolean;
  start_time: string | null;
  end_time: string | null;
}

const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const DAY_LABELS: Record<number, string> = {
  1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi',
  5: 'Vendredi', 6: 'Samedi', 7: 'Dimanche',
};

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [workload, setWorkload] = useState(0);
  const [loading, setLoading] = useState(true);

  const [workingHours, setWorkingHours] = useState<WorkingHourItem[]>([]);
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [savingHours, setSavingHours] = useState(false);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = useMemo(() => {
    const result: { day: number; currentMonth: boolean; dateKey: string }[] = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      result.push({ day: daysInPrevMonth - i, currentMonth: false, dateKey: '' });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ day, currentMonth: true, dateKey: formatDateKey(year, month, day) });
    }
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

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    try {
      const res = await api.get(`caterer/calendar?month=${monthKey}`);

      const bookingEvents: CalendarEvent[] = res.bookings.map((b: any) => ({
        date: b.event_date,
        label: b.title,
        type: 'booking',
      }));

      const blockEvents: CalendarEvent[] = res.blocks.flatMap((blk: any) => {
        const dates: CalendarEvent[] = [];
        let d = new Date(blk.start_date);
        const end = new Date(blk.end_date);
        while (d <= end) {
          dates.push({
            date: d.toISOString().slice(0, 10),
            label: blk.reason || 'Bloqué',
            type: 'vacation',
          });
          d.setDate(d.getDate() + 1);
        }
        return dates;
      });

      setEvents([...bookingEvents, ...blockEvents]);
      setWorkload(res.workload ?? 0);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  const loadWorkingHours = useCallback(async () => {
    try {
      const res = await api.get('caterer/working-hours');
      if (res.length === 7) {
        setWorkingHours(res);
      } else {
        // valeurs par défaut si pas encore configurées
        setWorkingHours(
          [1, 2, 3, 4, 5, 6, 7].map((day) => ({
            day_of_week: day,
            is_open: day !== 7,
            start_time: day === 7 ? null : '08:00',
            end_time: day === 7 ? null : day === 6 ? '22:00' : '18:00',
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  useEffect(() => {
    loadWorkingHours();
  }, [loadWorkingHours]);

  const handleBlockDates = async () => {
    const startDate = prompt('Date de début (AAAA-MM-JJ) :');
    if (!startDate) return;
    const endDate = prompt('Date de fin (AAAA-MM-JJ) :', startDate);
    if (!endDate) return;
    const reason = prompt('Raison du blocage :') ?? '';

    try {
      await api.post('caterer/availability/block', {
        start_date: startDate,
        end_date: endDate,
        reason,
      });
      loadCalendar();
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors du blocage. Vérifiez le format des dates (AAAA-MM-JJ).");
    }
  };

  const handleHourChange = (day: number, field: keyof WorkingHourItem, value: any) => {
    setWorkingHours((prev) =>
      prev.map((h) => (h.day_of_week === day ? { ...h, [field]: value } : h))
    );
  };

  const handleSaveHours = async () => {
    setSavingHours(true);
    try {
      await api.put('caterer/working-hours', { hours: workingHours });
      setHoursModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingHours(false);
    }
  };

  const eventTypeStyles: Record<CalendarEvent['type'], string> = {
    booking: 'bg-[#bc4733] text-white',
    prep: 'bg-[#9b2f1e] text-white',
    blocked: 'bg-[#7a4b00]/10 text-[#7a4b00] border border-[#ffb961]',
    vacation: 'bg-[#e7e2db] text-[#58423d]',
  };

  const upcomingEvents = events
    .filter((e) => e.date >= formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()) && e.type !== 'vacation')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const openDays = workingHours.filter((h) => h.is_open);
  const closedDays = workingHours.filter((h) => !h.is_open);

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
                  view === v ? 'bg-[#bc4733]/20 text-[#872111]' : 'text-[#58423d] hover:bg-[#ede7e0]'
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

            {loading ? (
              <div className="p-10 text-center text-[#58423d]">Chargement du calendrier...</div>
            ) : (
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
                      {todayCell && <p className="text-[10px] mt-1 font-bold text-[#9b2f1e]">Aujourd&apos;hui</p>}

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
            )}
          </div>
        </div>

        {/* Panneau latéral */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Charge mensuelle */}
          <div className="bg-white p-4 rounded-xl border border-[#dfc0ba] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#58423d] uppercase tracking-widest">Charge du mois</p>
              <h3 className="text-2xl font-bold text-[#9b2f1e]">{workload}%</h3>
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

            {workingHours.length === 0 ? (
              <p className="text-sm text-[#58423d]">Chargement...</p>
            ) : (
              <div className="space-y-2">
                {workingHours
                  .slice()
                  .sort((a, b) => a.day_of_week - b.day_of_week)
                  .map((h) => (
                    <div key={h.day_of_week} className="flex justify-between items-center text-sm">
                      <span className="text-[#58423d]">{DAY_LABELS[h.day_of_week]}</span>
                      {h.is_open ? (
                        <span className="font-bold">
                          {h.start_time?.slice(0, 5)} - {h.end_time?.slice(0, 5)}
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold">Fermé</span>
                      )}
                    </div>
                  ))}
              </div>
            )}

            <button
              onClick={() => setHoursModalOpen(true)}
              className="w-full mt-4 text-[#9b2f1e] text-sm font-bold flex items-center justify-center gap-1 hover:underline"
            >
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
              <h4 className="font-bold mb-1">Besoin d&apos;une pause ?</h4>
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

      {/* Modal de modification des horaires */}
      {hoursModalOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setHoursModalOpen(false);
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
            <div className="p-6 border-b border-[#dfc0ba] flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1d1b17]">Horaires habituels</h3>
              <button
                onClick={() => setHoursModalOpen(false)}
                className="p-2 hover:bg-[#ede7e0] rounded-full transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {workingHours
                .slice()
                .sort((a, b) => a.day_of_week - b.day_of_week)
                .map((h) => (
                  <div key={h.day_of_week} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-semibold text-[#1d1b17] shrink-0">
                      {DAY_LABELS[h.day_of_week]}
                    </span>

                    <label className="flex items-center gap-2 shrink-0">
                      <input
                        type="checkbox"
                        checked={h.is_open}
                        onChange={(e) => handleHourChange(h.day_of_week, 'is_open', e.target.checked)}
                        className="rounded border-[#dfc0ba] text-[#9b2f1e] focus:ring-[#9b2f1e]"
                      />
                      <span className="text-xs text-[#58423d]">Ouvert</span>
                    </label>

                    {h.is_open ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={h.start_time ?? '08:00'}
                          onChange={(e) => handleHourChange(h.day_of_week, 'start_time', e.target.value)}
                          className="border border-[#dfc0ba] rounded-lg px-2 py-1 text-sm flex-1"
                        />
                        <span className="text-[#58423d]">-</span>
                        <input
                          type="time"
                          value={h.end_time ?? '18:00'}
                          onChange={(e) => handleHourChange(h.day_of_week, 'end_time', e.target.value)}
                          className="border border-[#dfc0ba] rounded-lg px-2 py-1 text-sm flex-1"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-[#8b716c] italic flex-1">Fermé</span>
                    )}
                  </div>
                ))}
            </div>

            <div className="p-6 border-t border-[#dfc0ba] flex justify-end gap-3">
              <button
                onClick={() => setHoursModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-[#58423d] hover:bg-[#ede7e0] rounded-full transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveHours}
                disabled={savingHours}
                className="px-6 py-2 bg-[#9b2f1e] text-white rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
              >
                {savingHours ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}