'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;           
  placement?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const bgColors: Record<ToastType, string> = {
  success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
  info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
};

export function Toast({
  id,
  type,
  title,
  description,
  duration = 5000,
  placement = 'top-right',
  onClose,
  action,
}: ToastProps) {

  useEffect(() => {
    if (duration === Infinity) return;

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={`
        group flex w-full max-w-xs sm:max-w-sm shadow-2xl rounded-2xl border p-4 
        ${bgColors[type]} 
        animate-in slide-in-from-top-5 fade-in duration-300
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>

      <div className="ml-3.5 flex-1">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-sm text-neutral-900 dark:text-white">
            {title}
          </p>
          <button
            onClick={() => onClose(id)}
            className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300 transition-colors -mr-1 -mt-1 p-1 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {description && (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-snug">
            {description}
          </p>
        )}

        {action && (
          <button
            onClick={() => {
              action.onClick();
              onClose(id);
            }}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}