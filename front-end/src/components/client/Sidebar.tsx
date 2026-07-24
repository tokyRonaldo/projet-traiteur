// components/client/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Heart,
  FileText,
  ReceiptText,
  CalendarCheck,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { api } from '@/lib/api';

const navItems = [
  { label: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { label: 'Rechercher un traiteur', href: '/client/search', icon: Search },
  { label: 'Favoris', href: '/client/favorites', icon: Heart },
  { label: 'Mes demandes', href: '/client/requests', icon: FileText },
  { label: 'Devis reçus', href: '/client/quotes', icon: ReceiptText },
  { label: 'Réservations', href: '/client/bookings', icon: CalendarCheck },
  { label: 'Messages', href: '/client/messages', icon: MessageSquare },
];

interface ClientInfo {
  name: string;
  email: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [client, setClient] = useState<ClientInfo | null>(null);

  useEffect(() => {
    api
      .get('user')
      .then((data) => setClient({ name: data.name, email: data.email }))
      .catch(() => setClient(null));
  }, []);

  const initials = client?.name
    ? client.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '..';

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-6 px-4 bg-white border-r border-[#dfc0ba] z-50">
      <div className="mb-8 px-2">
        <span className="text-xl font-bold text-[#9b2f1e]">Saffron Hearth</span>
        <p className="text-xs text-[#58423d]">Espace client</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#ffdad4] text-[#9b2f1e] font-bold'
                  : 'text-[#58423d] hover:bg-[#f3ede6]'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#dfc0ba]">
        <Link
          href="/client/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#58423d] hover:bg-[#f3ede6] transition-colors"
        >
          <Settings className="w-4 h-4" strokeWidth={1.75} />
          Paramètres
        </Link>

        <div className="flex items-center px-4 py-3 mt-1">
          <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center text-[#9b2f1e] font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-bold text-[#1d1b17] truncate">{client?.name ?? '...'}</p>
            <p className="text-xs text-[#58423d] truncate">Compte client</p>
          </div>
        </div>
      </div>
    </aside>
  );
}