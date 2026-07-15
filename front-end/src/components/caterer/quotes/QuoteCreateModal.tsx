// components/caterer/quotes/QuoteCreateModal.tsx
'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { api } from '@/lib/api';

interface EventRequestSummary {
  id: number;
  client_name: string;
  event_type: string;
  event_date: string;
  guests_number: number;
  budget: number;
  message: string;
}

interface QuoteCreateModalProps {
  eventRequest: EventRequestSummary;
  onClose: () => void;
  onSent: () => void;
}

export default function QuoteCreateModal({ eventRequest, onClose, onSent }: QuoteCreateModalProps) {
  const [proposedPrice, setProposedPrice] = useState(String(eventRequest.budget ?? ''));
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!proposedPrice || Number(proposedPrice) <= 0) {
      setError('Merci de proposer un prix valide.');
      return;
    }

    setSaving(true);
    try {
      await api.post('caterer/quote/store', {
        event_request_id: eventRequest.id,
        proposed_price: proposedPrice,
        message,
      });
      onSent();
      onClose();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'envoi du devis.");
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
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
        <div className="p-6 border-b border-[#dfc0ba] flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-[#1d1b17]">Envoyer un devis</h3>
            <p className="text-sm text-[#58423d] mt-1">
              Pour la demande de {eventRequest.client_name} — {eventRequest.event_type}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#ede7e0] rounded-full transition-colors shrink-0">
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Rappel du contexte de la demande */}
        <div className="p-6 bg-[#f9f3ec] border-b border-[#dfc0ba]">
          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <p className="text-[#58423d] text-xs font-bold uppercase">Date</p>
              <p>{new Date(eventRequest.event_date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-[#58423d] text-xs font-bold uppercase">Invités</p>
              <p>{eventRequest.guests_number}</p>
            </div>
            <div>
              <p className="text-[#58423d] text-xs font-bold uppercase">Budget client</p>
              <p className="text-[#9b2f1e] font-bold">{eventRequest.budget?.toLocaleString()} €</p>
            </div>
          </div>
          {eventRequest.message && (
            <p className="text-sm italic text-[#1d1b17] border-l-4 border-[#7a4b00] pl-3">
              &quot;{eventRequest.message}&quot;
            </p>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">
              Prix proposé (€) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">
              Message pour le client
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre proposition, ce qui est inclus, vos conditions..."
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
              className="px-6 py-2 bg-[#9b2f1e] text-white rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" strokeWidth={1.75} />
              {saving ? 'Envoi...' : 'Envoyer le devis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}