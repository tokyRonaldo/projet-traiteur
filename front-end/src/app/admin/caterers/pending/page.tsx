// app/admin/caterers/pending/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';

export default function PendingCaterersPage() {
  const [caterers, setCaterers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('admin/caterers?verified=0').then((res) => setCaterers(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleValidate = async (id: number) => {
    await api.get(`admin/caterer/update-status/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Traiteurs en attente</h1>

      <DataTable
        loading={loading}
        data={caterers}
        columns={[
          { key: 'company_name', label: 'Entreprise' },
          { key: 'location', label: 'Ville' },
          { key: 'created_at', label: 'Date inscription', render: (r) => new Date(r.created_at).toLocaleDateString() },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <Link href={`/admin/caterers/${row.id}`} className="text-xs px-2 py-1 bg-gray-100 rounded">
                  Voir
                </Link>
                <button
                  onClick={() => handleValidate(row.id)}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                >
                  Valider
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}