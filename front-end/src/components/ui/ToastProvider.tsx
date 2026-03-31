'use client';

import { useToastStore } from '@/hooks/useToast';
import { Toast } from './Toast';

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  // Placement par défaut : top-right (tu peux le rendre configurable plus tard)
  const placement = 'top-right';

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={`fixed z-[100] flex flex-col gap-2 ${positionClasses[placement]}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}