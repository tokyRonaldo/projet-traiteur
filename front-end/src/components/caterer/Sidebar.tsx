// components/caterer/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserRound,
  UtensilsCrossed,
  Images,
  CalendarClock,
  Inbox,
  FileText,
  CalendarCheck,
  MessageSquare,
  Star,
  CreditCard,
  Crown,
  Bell,
  Settings,
} from 'lucide-react';

const sections = [
  {
    title: 'Vue d\'ensemble',
    items: [{ label: 'Dashboard', href: '/caterer/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Mon activité',
    items: [
      { label: 'Demandes', href: '/caterer/requests', icon: Inbox },
      { label: 'Devis', href: '/caterer/quotes', icon: FileText },
      { label: 'Réservations', href: '/caterer/bookings', icon: CalendarCheck },
      { label: 'Disponibilité', href: '/caterer/calendar', icon: CalendarClock },
    ],
  },
  {
    title: 'Mon entreprise',
    items: [
      { label: 'Profil', href: '/caterer/profile', icon: UserRound },
      { label: 'Services', href: '/caterer/services', icon: UtensilsCrossed },
      { label: 'Galerie', href: '/caterer/gallery', icon: Images },
    ],
  },
  {
    title: 'Communication',
    items: [
      { label: 'Messages', href: '/caterer/messages', icon: MessageSquare },
      { label: 'Avis & Notes', href: '/caterer/reviews', icon: Star },
    ],
  },
  {
    title: 'Compte',
    items: [
      { label: 'Paiements', href: '/caterer/payments', icon: CreditCard },
      { label: 'Abonnement', href: '/caterer/subscription', icon: Crown },
      { label: 'Notifications', href: '/caterer/notifications', icon: Bell },
      { label: 'Paramètres', href: '/caterer/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 fixed left-0 top-0 h-full bg-white border-r p-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-orange-600">Saffron Hearth</h1>
      <p className="text-xs text-gray-500 mb-6">Artisanal Catering</p>

      <nav className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-orange-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <Link
        href="/caterer/quotes/new"
        className="mt-6 block text-center w-full bg-orange-600 text-white py-2 rounded-full hover:bg-orange-700 transition-colors"
      >
        Nouveau devis
      </Link>
    </aside>
  );
}