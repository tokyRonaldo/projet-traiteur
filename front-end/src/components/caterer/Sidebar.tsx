// components/caterer/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UserRound, UtensilsCrossed, Images, CalendarClock,
  Inbox, FileText, CalendarCheck, MessageSquare, Star, CreditCard,
  Crown, Bell, Settings, ShieldCheck, Clock, Home, LogOut,
} from 'lucide-react';

const sections = [
  { title: "Vue d'ensemble", items: [{ label: 'Dashboard', href: '/caterer/dashboard', icon: LayoutDashboard }] },
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

interface CatererInfo {
  company_name: string;
  location: string;
  verified: boolean;
  logo_url: string | null;
}

interface SidebarProps {
  caterer: CatererInfo | null;
  profileLoading: boolean;
  onLogoutClick: () => void;
}

export default function Sidebar({ caterer, profileLoading, onLogoutClick }: SidebarProps) {
  const pathname = usePathname();

  const initials = caterer?.company_name
    ? caterer.company_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '..';

  return (
    <aside className="w-72 fixed left-0 top-0 h-full bg-white border-r p-4 overflow-y-auto flex flex-col">
      <div className="mb-6 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {profileLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ) : caterer ? (
            <Link href="/caterer/profile" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden shrink-0">
                {caterer.logo_url ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${caterer.logo_url}`}
                    alt={caterer.company_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-orange-700 font-bold text-sm">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                  {caterer.company_name}
                </h1>
                <p className="text-xs text-gray-500 truncate">{caterer.location}</p>
              </div>
            </Link>
          ) : (
            <div>
              <h1 className="text-xl font-bold text-orange-600">Mon entreprise</h1>
              <p className="text-xs text-gray-500">Complétez votre profil</p>
            </div>
          )}
        </div>

        <Link
          href="/"
          title="Retour à l'accueil"
          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors shrink-0"
        >
          <Home className="w-4 h-4" strokeWidth={1.75} />
        </Link>
      </div>

      {!profileLoading && caterer && (
        <div className="mb-6 -mt-4">
          {caterer.verified ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
              Compte vérifié
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
              En attente de validation
            </span>
          )}
        </div>
      )}

      <nav className="space-y-6 flex-1">
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
                      isActive ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
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

      <div className="pt-4 mt-4 border-t border-gray-200">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}