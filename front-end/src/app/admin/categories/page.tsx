// app/admin/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', type: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.get('admin/categories').then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', type: '' });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.type) return;

    if (editingId) {
      await api.put(`admin/category/update/${editingId}`, form);
    } else {
      await api.post('admin/category/store', form);
    }
    resetForm();
    load();
  };

  const handleEdit = (cat: any) => {
    setForm({ name: cat.name, type: cat.type });
    setEditingId(cat.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await api.delete(`admin/category/delete/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Catégories</h1>

      <div className="bg-white rounded-lg shadow p-4 flex gap-3 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
            placeholder="Ex: Mariage"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <input
            type="text"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
            placeholder="Ex: événement / cuisine"
          />
        </div>
        <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">
          {editingId ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {editingId && (
          <button onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded text-sm">
            Annuler
          </button>
        )}
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {categories.map((cat) => (
            <div key={cat.id} className="flex justify-between items-center p-3">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.type}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cat)} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Modifier
                </button>
                <button onClick={() => handleDelete(cat.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}