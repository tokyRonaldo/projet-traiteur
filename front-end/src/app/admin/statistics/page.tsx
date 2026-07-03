// app/admin/statistics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [topCategories, setTopCategories] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [topCaterers, setTopCaterers] = useState([]);

  useEffect(() => {
    api.get('admin/statistics').then(setStats);
    api.get('admin/statistics/top-categories').then(setTopCategories);
    api.get('admin/statistics/top-cities').then(setTopCities);
    api.get('admin/statistics/top-caterers').then(setTopCaterers);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistiques</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">{key.replace(/_/g, ' ')}</p>
              <p className="text-xl font-bold">{value as string}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Top catégories</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Top villes</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topCities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Top traiteurs</h2>
          <ul className="text-sm space-y-2">
            {topCaterers.map((c: any) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.company_name}</span>
                <span className="text-gray-500">⭐ {c.rating}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}