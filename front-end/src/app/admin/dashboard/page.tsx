// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [registrations, setRegistrations] = useState([]);
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    alert('test');
    api.get('admin/dashboard').then(setStats);
    api.get('admin/dashboard/registrations-chart').then(setRegistrations);
    api.get('admin/dashboard/revenue-chart').then(setRevenue);
    alert('test2');
  }, []);

  const cards = stats
    ? [
        { label: 'Clients', value: stats.clients_count },
        { label: 'Traiteurs', value: stats.caterers_count },
        { label: 'Traiteurs en attente', value: stats.caterers_pending },
        { label: 'Services publiés', value: stats.services_count },
        { label: "Demandes aujourd'hui", value: stats.requests_today },
        { label: 'Réservations du mois', value: stats.bookings_this_month },
        { label: 'Revenus', value: `${stats.revenue} €` },
        { label: 'Nouveaux utilisateurs', value: stats.new_users_this_month },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold">{c.value ?? '-'}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Inscriptions mensuelles</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={registrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Revenus</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}