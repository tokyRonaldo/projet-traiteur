'use client';

import { useEffect, useState } from 'react';
import CustomToast from '@/components/ui/CustomToast';

export default function ToastProvider() {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    const storedToast = localStorage.getItem('toast');

    if (storedToast) {
      setToast(JSON.parse(storedToast));
      localStorage.removeItem('toast');
    }
  }, []);

  if (!toast) return null;

  return (
    <CustomToast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
      duration={toast.type === 'success' ? 2500 : 6000}
    />
  );
}