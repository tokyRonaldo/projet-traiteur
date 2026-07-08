// app/admin/payments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`admin/payments${statusFilter ? `?status=${statusFilter}` : ''}`)
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paiements</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="completed">Complété</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoué</option>
        </select>
      </div>

      <DataTable
        loading={loading}
        data={payments}
        columns={[
          { key: 'user', label: 'Utilisateur', render: (r) => r.user?.name },
          { key: 'amount', label: 'Montant', render: (r) => `${r.amount} €` },
          {
            key: 'type',
            label: 'Type',
            render: (r) => (r.subscription_id ? 'Abonnement' : 'Événement'),
          },
          { key: 'transaction_id', label: 'Transaction' },
          { key: 'status', label: 'Statut', render: (r) => <Badge status={r.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <Link href={`/admin/payments/${row.id}`} className="text-xs px-2 py-1 bg-gray-100 rounded">
                Voir
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}