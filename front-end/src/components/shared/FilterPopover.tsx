// components/shared/FilterPopover.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export const filterInputClass =
  'w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none';

export function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#58423d] mb-1">{label}</label>
      {children}
    </div>
  );
}

interface FilterPopoverProps {
  activeCount: number;
  onReset: () => void;
  children: React.ReactNode;
}

export default function FilterPopover({ activeCount, onReset, children }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dfc0ba] rounded-lg text-[#58423d] hover:bg-[#f9f3ec] transition-all"
      >
        <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
        <span className="text-sm font-semibold">Filtres</span>
        {activeCount > 0 && (
          <span className="bg-[#9b2f1e] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#dfc0ba] rounded-xl shadow-lg p-4 z-30 space-y-4">
          {children}
          <div className="flex justify-between pt-3 border-t border-[#dfc0ba]">
            <button
              onClick={onReset}
              disabled={activeCount === 0}
              className="text-sm font-semibold text-[#58423d] disabled:opacity-40"
            >
              Réinitialiser
            </button>
            <button onClick={() => setOpen(false)} className="text-sm font-bold text-[#9b2f1e]">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}