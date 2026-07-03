// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Utilisateurs' },
  { href: '/admin/caterers/pending', label: 'Traiteurs en attente' },
  { href: '/admin/caterers', label: 'Traiteurs validés' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/event-requests', label: 'Demandes' },
  { href: '/admin/payments', label: 'Paiements' },
  { href: '/admin/reviews', label: 'Avis' },
  { href: '/admin/statistics', label: 'Statistiques' },
  { href: '/admin/settings', label: 'Paramètres' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 min-h-screen">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded text-sm ${
              pathname === link.href ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}