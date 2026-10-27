// components/admin/adminNav.ts
import {
  LayoutDashboard, UserRound, Users, Clock, ShieldCheck, UtensilsCrossed,
  Tags, Inbox, FileText, CalendarCheck, CreditCard, Star, BarChart3, Settings,
} from 'lucide-react';

export const adminSections = [
  { title: "Vue d'ensemble", items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
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
  { title: 'Mon compte', items: [{ href: '/admin/profile', label: 'Mon profil', icon: UserRound }] },
];

export function getPageTitle(pathname: string): string {
  const all = adminSections.flatMap((s) => s.items);
  const exact = all.find((i) => i.href === pathname);
  if (exact) return exact.label;
  // pages de détail (ex: /admin/caterers/12) : on prend le plus long préfixe qui correspond
  const prefix = all
    .filter((i) => pathname.startsWith(i.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return prefix?.label ?? 'Administration';
}