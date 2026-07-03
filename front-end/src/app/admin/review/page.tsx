// app/admin/reviews/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('admin/reviews').then((res) => setReviews(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleHide = async (id: number, hidden: boolean) => {
    await api.put(`admin/review/${hidden ? 'unhide' : 'hide'}/${id}`);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer cet avis ?')) return;
    await api.delete(`admin/review/delete/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Avis</h1>
      <DataTable
        loading={loading}
        data={reviews}
        columns={[
          { key: 'rating', label: 'Note', render: (r) => '⭐'.repeat(r.rating) },
          { key: 'comment', label: 'Commentaire' },
          { key: 'user', label: 'Client', render: (r) => r.user?.name },
          { key: 'caterer', label: 'Traiteur', render: (r) => r.caterer?.company_name },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <button onClick={() => toggleHide(row.id, row.is_hidden)} className="text-xs px-2 py-1 bg-yellow-100 rounded">
                  {row.is_hidden ? 'Réafficher' : 'Masquer'}
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