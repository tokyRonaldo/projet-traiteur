// app/admin/event-requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';

export default function EventRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`admin/event-requests${statusFilter ? `?status=${statusFilter}` : ''}`)
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Demandes</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="accepted">Acceptée</option>
          <option value="rejected">Refusée</option>
        </select>
      </div>

      <DataTable
        loading={loading}
        data={requests}
        columns={[
          { key: 'client', label: 'Client', render: (r) => r.client?.name },
          { key: 'caterer', label: 'Traiteur', render: (r) => r.caterer?.company_name },
          { key: 'event_date', label: 'Date', render: (r) => new Date(r.event_date).toLocaleDateString() },
          { key: 'budget', label: 'Budget', render: (r) => `${r.budget} €` },
          { key: 'status', label: 'Statut', render: (r) => <Badge status={r.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <Link href={`/admin/event-requests/${row.id}`} className="text-xs px-2 py-1 bg-gray-100 rounded">
                Voir
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}