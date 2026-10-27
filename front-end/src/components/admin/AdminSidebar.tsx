// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LogOut, X } from 'lucide-react';
import { adminSections } from './adminNav';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

export default function AdminSidebar({ isOpen, onClose, onLogoutClick }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}

      <aside
        className={`w-64 fixed left-0 top-0 h-full bg-gray-900 text-white p-4 overflow-y-auto flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              title="Retour à l'accueil"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" strokeWidth={1.75} />
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
              aria-label="Fermer le menu"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <nav className="space-y-5 flex-1">
          {adminSections.map((section) => (
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
                      onClick={onClose}
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

        <div className="pt-4 mt-4 border-t border-gray-700">
          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}