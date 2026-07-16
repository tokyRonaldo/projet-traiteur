// components/caterer/calendar/BlockDatesModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { X, Ban, Trash2, CalendarOff } from 'lucide-react';
import { api } from '@/lib/api';

interface BlockItem {
  id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
}

interface BlockDatesModalProps {
  onClose: () => void;
  onChanged: () => void;
}

export default function BlockDatesModal({ onClose, onChanged }: BlockDatesModalProps) {
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  const loadBlocks = () => {
    setLoading(true);
    api
      .get('caterer/availability/blocks')
      .then(setBlocks)
      .catch(() => setBlocks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const handleAddBlock = async () => {
    setError(null);

    if (!startDate || !endDate) {
      setError('Merci de renseigner les deux dates.');
      return;
    }
    if (endDate < startDate) {
      setError('La date de fin doit être après la date de début.');
      return;
    }

    setSaving(true);
    try {
      await api.post('caterer/availability/block', {
        start_date: startDate,
        end_date: endDate,
        reason: reason || null,
      });
      setStartDate('');
      setEndDate('');
      setReason('');
      loadBlocks();
      onChanged();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du blocage.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce blocage ?')) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    try {
      await api.delete(`caterer/availability/unblock/${id}`);
      onChanged();
    } catch {
      loadBlocks();
    }
  };

  const formatRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const e = new Date(end).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    return start === end ? e : `${s} → ${e}`;
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
          <h3 className="text-xl font-bold text-[#1d1b17] flex items-center gap-2">
            <Ban className="w-5 h-5 text-[#9b2f1e]" strokeWidth={1.75} />
            Gérer les blocages
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#ede7e0] rounded-full transition-colors">
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Formulaire d'ajout */}
        <div className="p-6 border-b border-[#dfc0ba] space-y-3 bg-[#f9f3ec]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-1">Date de début</label>
              <input
                type="date"
                value={startDate}
                min={todayStr}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-1">Date de fin</label>
              <input
                type="date"
                value={endDate}
                min={startDate || todayStr}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Raison (optionnel)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : Congés, maintenance cuisine..."
              className="w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleAddBlock}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#9b2f1e] text-white rounded-lg text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
          >
            <Ban className="w-4 h-4" strokeWidth={1.75} />
            {saving ? 'Blocage en cours...' : 'Bloquer cette période'}
          </button>
        </div>

        {/* Liste des blocages existants */}
        <div className="p-6 max-h-64 overflow-y-auto">
          <h4 className="text-xs font-bold text-[#58423d] uppercase tracking-wider mb-3">
            Blocages à venir
          </h4>

          {loading && <p className="text-sm text-[#58423d]">Chargement...</p>}

          {!loading && blocks.length === 0 && (
            <div className="flex flex-col items-center text-center py-6">
              <CalendarOff className="w-8 h-8 text-[#8b716c] mb-2" strokeWidth={1.5} />
              <p className="text-sm text-[#58423d]">Aucun blocage prévu.</p>
            </div>
          )}

          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-3 bg-[#f3ede6] rounded-lg border border-[#dfc0ba]"
              >
                <div>
                  <p className="font-semibold text-sm">{formatRange(block.start_date, block.end_date)}</p>
                  {block.reason && <p className="text-xs text-[#58423d]">{block.reason}</p>}
                </div>
                <button
                  onClick={() => handleDelete(block.id)}
                  className="p-2 text-[#8b716c] hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}