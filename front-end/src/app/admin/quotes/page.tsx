// app/admin/quotes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`admin/quotes${statusFilter ? `?status=${statusFilter}` : ''}`)
      .then((res) => setQuotes(res.data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Devis</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="accepted">Accepté</option>
          <option value="rejected">Refusé</option>
        </select>
      </div>

      <DataTable
        loading={loading}
        data={quotes}
        columns={[
          { key: 'proposed_price', label: 'Prix', render: (r) => `${r.proposed_price} €` },
          { key: 'client', label: 'Client', render: (r) => r.event_request?.client?.name },
          { key: 'caterer', label: 'Traiteur', render: (r) => r.caterer?.company_name },
          { key: 'status', label: 'Statut', render: (r) => <Badge status={r.status} /> },
          { key: 'sent_at', label: 'Date', render: (r) => new Date(r.sent_at).toLocaleDateString() },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <Link href={`/admin/quotes/${row.id}`} className="text-xs px-2 py-1 bg-gray-100 rounded">
                Voir
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}