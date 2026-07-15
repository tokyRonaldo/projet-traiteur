// components/caterer/quotes/QuoteEditModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';

interface QuoteEditModalProps {
  quote: {
    id: number;
    proposed_price: number;
    message?: string;
  };
  onClose: () => void;
  onSaved: () => void;
}

export default function QuoteEditModal({ quote, onClose, onSaved }: QuoteEditModalProps) {
  const [price, setPrice] = useState(String(quote.proposed_price));
  const [message, setMessage] = useState(quote.message ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!price || Number(price) <= 0) {
      setError('Merci de saisir un prix valide.');
      return;
    }

    setSaving(true);
    try {
      await api.put(`caterer/quote/update/${quote.id}`, {
        proposed_price: price,
        message,
      });
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
      className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
        <div className="p-6 border-b border-[#dfc0ba] flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#1d1b17]">Modifier le devis</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#ede7e0] rounded-full transition-colors">
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Prix proposé (€) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all resize-y"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

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
              {saving ? 'Enregistrement...' : 'Mettre à jour'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}