// components/caterer/dashboard/DashboardGrid.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Banknote,
  CalendarCheck,
  Star,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';

interface DashboardStats {
  pending_requests: number;
  requests_today: number;
  bookings_this_month: number;
  revenue_total: number;
  revenue_this_month: number;
  average_rating: number;
  reviews_count: number;
  pending_quotes: number;
}

interface UpcomingBooking {
  id: number;
  title: string;
  event_date: string;
  guests_number: number;
}

export default function DashboardGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingBooking[]>([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('caterer/dashboard'),
      api.get('caterer/dashboard/upcoming'),
      api.get('caterer/dashboard/revenue-chart'),
    ])
      .then(([s, u, r]) => {
        setStats(s);
        setUpcoming(u);
        setRevenueData(r);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[#58423d]">Chargement du tableau de bord...</p>;

  const cards = [
    {
      label: 'Demandes en attente',
      value: stats?.pending_requests ?? 0,
      icon: Inbox,
      href: '/caterer/requests',
      color: 'text-[#9b2f1e] bg-[#ffdad4]',
    },
    {
      label: 'Devis en attente',
      value: stats?.pending_quotes ?? 0,
      icon: FileText,
      href: '/caterer/quotes',
      color: 'text-[#7a4b00] bg-[#ffddb9]',
    },
    {
      label: 'Réservations ce mois',
      value: stats?.bookings_this_month ?? 0,
      icon: CalendarCheck,
      href: '/caterer/bookings',
      color: 'text-[#586062] bg-[#dae1e3]',
    },
    {
      label: 'Note moyenne',
      value: stats?.average_rating ? `${stats.average_rating} / 5` : '—',
      icon: Star,
      href: '/caterer/reviews',
      color: 'text-[#9b2f1e] bg-[#ffdad4]',
      subtitle: `${stats?.reviews_count ?? 0} avis`,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17]">Tableau de bord</h2>
        <p className="text-[#58423d]">Vue d'ensemble de votre activité.</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-[#dfc0ba] rounded-xl p-4 flex flex-col gap-2 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[#58423d] text-xs font-semibold uppercase tracking-wider">
                {card.label}
              </span>
              <span className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" strokeWidth={1.75} />
              </span>
            </div>
            <span className="text-3xl font-bold">{card.value}</span>
            {card.subtitle && <span className="text-xs text-[#58423d]">{card.subtitle}</span>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenu */}
        <div className="lg:col-span-2 bg-white border border-[#dfc0ba] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Revenu (6 derniers mois)</h3>
            <span className="text-[#9b2f1e] font-bold text-xl">
              {stats?.revenue_total.toLocaleString()} €
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfc0ba" />
              <XAxis dataKey="month" stroke="#58423d" fontSize={12} />
              <YAxis stroke="#58423d" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#9b2f1e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Prochains événements */}
        <div className="bg-white border border-[#dfc0ba] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Prochains événements</h3>
            <Link href="/caterer/bookings" className="text-[#9b2f1e] text-sm font-semibold hover:underline flex items-center gap-1">
              Tout voir <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <p className="text-sm text-[#58423d]">Aucun événement à venir.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div key={b.id} className="flex gap-3 border-b border-[#dfc0ba]/50 pb-3 last:border-0">
                  <div className="w-1 rounded-full bg-[#9b2f1e]" />
                  <div>
                    <p className="text-xs font-bold text-[#9b2f1e]">
                      {new Date(b.event_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="font-semibold text-sm">{b.title}</p>
                    <p className="text-xs text-[#58423d]">{b.guests_number} invités</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}