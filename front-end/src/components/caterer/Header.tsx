// components/caterer/Header.tsx
'use client';

import { useState } from 'react';
import { Search, CircleHelp, CircleUserRound } from 'lucide-react';

export default function Header() {
  const [focused, setFocused] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-72 z-40 flex justify-between items-center px-6 py-3 bg-[#fef8f1] border-b border-[#dfc0ba]">
      <div
        className={`flex items-center bg-white border rounded-full px-4 py-2 w-96 transition-all ${
          focused ? 'border-[#9b2f1e] ring-2 ring-[#9b2f1e]/20' : 'border-[#dfc0ba]'
        }`}
      >
        <Search className="w-4 h-4 text-[#58423d] mr-2 shrink-0" strokeWidth={1.75} />
        <input
          type="text"
          placeholder="Rechercher une commande ou un client..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-[#58423d]/50 text-[#1d1b17]"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-[#58423d] hover:bg-[#ede7e0] p-2 rounded-full transition-all"
          aria-label="Aide"
        >
          <CircleHelp className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="text-[#9b2f1e] hover:bg-[#ede7e0] p-2 rounded-full transition-all"
          aria-label="Mon compte"
        >
          <CircleUserRound className="w-5 h-5" strokeWidth={2} fill="#ffedea" />
        </button>
      </div>
    </header>
  );
}