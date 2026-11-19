// components/shared/ConfirmModal.tsx
'use client';

import { useEffect, useState } from 'react';

interface ConfirmModalProps {
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  variant?: 'primary' | 'danger';
  withReason?: boolean;
  reasonLabel?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title, message, confirmLabel, variant = 'primary', withReason, reasonLabel = 'Raison (optionnel)',
  loading, error, onConfirm, onCancel,
}: ConfirmModalProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !loading && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [loading, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !loading && onCancel()}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
        <h3 className="text-lg font-bold text-[#1d1b17] mb-2">{title}</h3>
        <div className="text-sm text-[#58423d] mb-4">{message}</div>

        {withReason && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#58423d] mb-1">{reasonLabel}</label>
            <textarea
              rows={3}
              maxLength={255}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none resize-none"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-[#dfc0ba] text-[#58423d] rounded-full text-sm font-semibold hover:bg-[#f9f3ec] transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#9b2f1e] hover:bg-[#872111]'
            }`}
          >
            {loading ? 'Traitement...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}