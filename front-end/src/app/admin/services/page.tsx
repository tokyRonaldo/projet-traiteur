// app/admin/services/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('admin/services').then((res) => setServices(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: number, active: boolean) => {
    await api.put(`admin/service/${active ? 'disable' : 'enable'}/${id}`);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce service ?')) return;
    await api.delete(`admin/service/delete/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Services</h1>
      <DataTable
        loading={loading}
        data={services}
        columns={[
          { key: 'title', label: 'Titre' },
          { key: 'caterer', label: 'Traiteur', render: (r) => r.caterer?.company_name },
          { key: 'category', label: 'Catégorie', render: (r) => r.category?.name },
          { key: 'price', label: 'Prix', render: (r) => `${r.price} €` },
          { key: 'is_active', label: 'Statut', render: (r) => <Badge status={r.is_active} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <button onClick={() => toggle(row.id, row.is_active)} className="text-xs px-2 py-1 bg-yellow-100 rounded">
                  {row.is_active ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => remove(row.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                  Supprimer
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}