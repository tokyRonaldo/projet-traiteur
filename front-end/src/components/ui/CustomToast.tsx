'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
type ToastType = 'success' | 'error';

interface CustomToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function CustomToast({
  message,
  type,
  onClose,
  duration = 5000,
}: CustomToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' 
    ? 'bg-emerald-600' 
    : 'bg-red-600';

  const icon = type === 'success' ? '✓' : '⚠';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl text-white min-w-[320px] max-w-[420px]"
         style={{ backgroundColor: bgColor }}>
      
      <div className="text-2xl flex-shrink-0 text-red-700">
        {icon}
      </div>

      <p className="flex-1 text-sm font-medium leading-snug text-neutral-700">
        {message}
      </p>

      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/20"
        aria-label="Fermer"
      >
        <X size={20} />
      </button>
    </div>
  );
}