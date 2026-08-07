// components/shared/LogoutConfirmModal.tsx
'use client';

import { LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function LogoutConfirmModal({ onConfirm, onCancel, loading }: LogoutConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-6 h-6 text-red-600" strokeWidth={1.75} />
          </div>
          <h3 className="text-lg font-bold text-[#1d1b17] mb-2">Se déconnecter ?</h3>
          <p className="text-sm text-[#58423d] mb-6">
            Vous devrez vous reconnecter pour accéder à votre compte.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-[#dfc0ba] text-[#58423d] rounded-full text-sm font-semibold hover:bg-[#f9f3ec] transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Déconnexion...' : 'Se déconnecter'}
            </button>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 hidden"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}