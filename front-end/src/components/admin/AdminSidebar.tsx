// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserRound,
  Users,
  Clock,
  ShieldCheck,
  UtensilsCrossed,
  Tags,
  Inbox,
  FileText,
  CalendarCheck,
  CreditCard,
  Star,
  BarChart3,
  Settings,
} from 'lucide-react';

const sections = [
  {
    title: 'Vue d\'ensemble',
    items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Utilisateurs',
    items: [
      { href: '/admin/users', label: 'Utilisateurs', icon: Users },
      { href: '/admin/caterers/pending', label: 'Traiteurs en attente', icon: Clock },
      { href: '/admin/caterers', label: 'Traiteurs validés', icon: ShieldCheck },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { href: '/admin/services', label: 'Services', icon: UtensilsCrossed },
      { href: '/admin/categories', label: 'Catégories', icon: Tags },
    ],
  },
  {
    title: 'Activité',
    items: [
      { href: '/admin/event-requests', label: 'Demandes', icon: Inbox },
      { href: '/admin/quotes', label: 'Devis', icon: FileText },
      { href: '/admin/bookings', label: 'Réservations', icon: CalendarCheck },
      { href: '/admin/payments', label: 'Paiements', icon: CreditCard },
      { href: '/admin/reviews', label: 'Avis', icon: Star },
    ],
  },
  {
    title: 'Plateforme',
    items: [
      { href: '/admin/statistics', label: 'Statistiques', icon: BarChart3 },
      { href: '/admin/settings', label: 'Paramètres', icon: Settings },
    ],
  },
  {
    title: 'Mon compte',
    items: [{ href: '/admin/profile', label: 'Mon profil', icon: UserRound }],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 min-h-screen overflow-y-auto">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <nav className="space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                      isActive ? 'bg-gray-700 text-white font-medium' : 'text-gray-300 hover:bg-gray-800'
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
    </aside>
  );
}