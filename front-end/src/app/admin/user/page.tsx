// app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import Badge from '@/components/admin/Badge';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = () => {
    setLoading(true);
    api.get(`admin/user${search ? `?search=${search}` : ''}`)
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, [search]);

  const handleSuspend = async (id: number, isBanned: boolean) => {
    await api.put(`admin/user/${isBanned ? 'unsuspend' : 'suspend'}/${id}`);
    loadUsers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await api.delete(`admin/user/delete/${id}`);
    loadUsers();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
      </div>

      <DataTable
        loading={loading}
        data={users}
        columns={[
          { key: 'name', label: 'Nom' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Téléphone' },
          {
            key: 'roles',
            label: 'Rôle',
            render: (row) => row.roles?.map((r: any) => r.name).join(', '),
          },
          {
            key: 'is_banned',
            label: 'Statut',
            render: (row) => <Badge status={!row.is_banned} />,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSuspend(row.id, row.is_banned)}
                  className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded"
                >
                  {row.is_banned ? 'Réactiver' : 'Suspendre'}
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded"
                >
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