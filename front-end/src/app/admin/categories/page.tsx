// app/admin/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { apiUpload } from '@/lib/apiUpload';

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

  const handleImageChange = async (catId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      await apiUpload(`admin/category/${catId}/image`, formData);
      load(); // recharge la liste
    } catch (err: any) {
      alert(err.message || "Impossible d'envoyer l'image.");
    }
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
                {/* dans chaque ligne de catégorie, avant le nom */}
                <label className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer shrink-0 hover:ring-2 hover:ring-indigo-300 transition">
                  {cat.image_url ? (
                    <img
                      src={`${process.env.LARAVEL_API_URL}${cat.image_url}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-gray-400 text-center px-1">+ Image</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(cat.id, e)}
                  />
                </label>
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