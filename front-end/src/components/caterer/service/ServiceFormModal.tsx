// components/caterer/service/ServiceFormModal.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { ImageOff, Trash2, UploadCloud } from 'lucide-react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  type: string;
}

interface ServiceFormData {
  id?: number;
  title: string;
  description: string;
  price: string;
  category_id: string;
  event_type: string;
}

interface ServiceFormModalProps {
  initialData?: ServiceFormData | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_FORM: ServiceFormData = {
  title: '',
  description: '',
  price: '',
  category_id: '',
  event_type: '',
};

export default function ServiceFormModal({ initialData, onClose, onSaved }: ServiceFormModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ServiceFormData>(initialData ?? EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceMedia, setServiceMedia] = useState<{ id: number; url: string; type: string }[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const loadServiceMedia = () => {
    if (!form.id) return;
    api.get(`caterer/service/${form.id}/media`).then(setServiceMedia).catch(() => setServiceMedia([]));
  };

  useEffect(() => {
    loadServiceMedia();
  }, [form.id]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form.id) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingMedia(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/caterer/service/${form.id}/media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      loadServiceMedia();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingMedia(false);
      if (mediaInputRef.current) mediaInputRef.current.value = '';
    }
  };

  const handleMediaDelete = async (mediaId: number) => {
    setServiceMedia((prev) => prev.filter((m) => m.id !== mediaId));
    try {
      await api.delete(`caterer/service/media/${mediaId}`);
    } catch {
      loadServiceMedia();
    }
  };

  useEffect(() => {
    api.get('caterer/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleChange = (field: keyof ServiceFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.title || !form.price || !form.category_id || !form.event_type) {
      setError('Merci de remplir tous les champs obligatoires.');
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        await api.put(`caterer/service/update/${form.id}`, form);
      } else {
        await api.post('caterer/service/store', form);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
        <div className="p-6 border-b border-[#dfc0ba] flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#1d1b17]">
            {form.id ? 'Modifier le service' : 'Ajouter un service'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#ede7e0] rounded-full transition-colors">
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Titre du service *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex : Buffet Mariage Prestige"
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez ce service..."
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-1">Prix par personne (€) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-1">Catégorie *</label>
              <select
                value={form.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all bg-white"
              >
                <option value="">Sélectionner...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Type d'événement *</label>
            <input
              type="text"
              value={form.event_type}
              onChange={(e) => handleChange('event_type', e.target.value)}
              placeholder="Ex : Mariage, Entreprise, Privé"
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {form.id && (
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-2">
                Photos du service
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {serviceMedia.map((m) => (
                  <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden bg-[#ede7e0] group">
                    {m.type === 'image' ? (
                      <img src={ `${process.env.NEXT_PUBLIC_API_URL}${m.url}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <span className="text-white text-xs">Vidéo</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleMediaDelete(m.id)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={uploadingMedia}
                  className="aspect-square rounded-lg border-2 border-dashed border-[#dfc0ba] flex items-center justify-center hover:border-[#9b2f1e] transition-colors"
                >
                  <UploadCloud className="w-5 h-5 text-[#8b716c]" strokeWidth={1.5} />
                </button>
              </div>
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/*,video/mp4"
                onChange={handleMediaUpload}
                className="hidden"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#58423d] hover:bg-[#ede7e0] rounded-full transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2 bg-[#9b2f1e] text-white rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : form.id ? 'Mettre à jour' : 'Créer le service'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}