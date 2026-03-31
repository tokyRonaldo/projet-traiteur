'use client';

import { create } from 'zustand';

type Toast = {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).slice(2) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const useToast = () => {
  const { addToast, removeToast } = useToastStore();

  const toast = {
    success: (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast({ type: 'success', title, description, ...options }),

    error: (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast({ type: 'error', title, description, ...options }),

    warning: (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast({ type: 'warning', title, description, ...options }),

    info: (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) =>
      addToast({ type: 'info', title, description, ...options }),
  };

  return { toast, removeToast };
};