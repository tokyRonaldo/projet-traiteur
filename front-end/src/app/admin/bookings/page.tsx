// app/admin/bookings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`admin/bookings${statusFilter ? `?status=${statusFilter}` : ''}`)
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Réservations</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="accepted">Confirmé</option>
          <option value="cancelled">Annulé</option>
          <option value="completed">Terminé</option>
        </select>
      </div>

      <DataTable
        loading={loading}
        data={bookings}
        columns={[
          { key: 'client', label: 'Client', render: (r) => r.client?.name },
          { key: 'caterer', label: 'Traiteur', render: (r) => r.caterer?.company_name },
          { key: 'event_date', label: 'Date', render: (r) => new Date(r.event_date).toLocaleDateString() },
          { key: 'budget', label: 'Prix', render: (r) => `${r.budget} €` },
          { key: 'status', label: 'Statut', render: (r) => <Badge status={r.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <Link href={`/admin/bookings/${row.id}`} className="text-xs px-2 py-1 bg-gray-100 rounded">
                Voir
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}