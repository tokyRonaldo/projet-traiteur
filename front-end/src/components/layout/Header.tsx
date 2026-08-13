// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import LogoutConfirmModal from '@/components/shared/LogoutConfirmModal';

const DASHBOARD_BY_ROLE: Record<string, string> = {
  client: '/client/dashboard',
  traiteur: '/caterer/dashboard',
  admin: '/admin/dashboard',
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { modalOpen, loading: logoutLoading, requestLogout, cancelLogout, confirmLogout } = useLogout('/login');

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const roleName = user?.roles?.[0]?.name ?? user?.roles?.[0] ?? null;
  const dashboardHref = roleName ? DASHBOARD_BY_ROLE[roleName] ?? '/' : '/';

  const handleLogoutClick = () => {
    closeMenu();
    requestLogout();
  };

  if (authLoading) {
    return (
      <header className="sticky top-0 z-50 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl border-b border-primary/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><span className="font-bold text-xl">Caterly</span></Link>
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </nav>
      </header>
    );
  }

  return (
    <>
        {/* Overlay sombre sur mobile quand la sidebar est ouverte */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <header className="sticky top-0 z-50 bg-background dark:bg-background-dark md:bg-background-light/50 md:dark:bg-background-dark/50 backdrop-blur-xl border-b border-primary/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><span className="font-bold text-xl">Caterly</span></Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/caterer" className="text-sm font-semibold hover:text-primary transition-colors">Traiteurs</Link>
            <Link href="#categories" className="text-sm font-semibold hover:text-primary transition-colors">Catégories</Link>
            <Link href="#how-it-works" className="text-sm font-semibold hover:text-primary transition-colors">Comment ça marche</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="primary" asChild>
                  <Link href={dashboardHref}>
                    {user?.name ? `Bonjour, ${user.name.split(' ')[0]}` : 'Mon espace'}
                  </Link>
                </Button>
                <button
                  onClick={handleLogoutClick}
                  className="p-2 text-neutral-500 hover:text-primary transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild><Link href="/login">Connexion</Link></Button>
                <Button variant="primary" asChild><Link href="/register/user">Inscription</Link></Button>
              </>
            )}
          </div>

          <button onClick={toggleMenu} className="md:hidden text-2xl text-foreground p-2" aria-label="Menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {isOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 md:bg-background-light md:dark:bg-background-dark bg-background dark:bg-background-dark border-b border-primary/10 shadow-lg">
              <div className="px-6 py-8 flex flex-col gap-6 text-center">
                <Link href="/caterers" className="text-lg font-semibold py-2" onClick={closeMenu}>Traiteurs</Link>
                <Link href="#categories" className="text-lg font-semibold py-2" onClick={closeMenu}>Catégories</Link>
                <Link href="#how-it-works" className="text-lg font-semibold py-2" onClick={closeMenu}>Comment ça marche</Link>

                <div className="flex flex-col gap-3 pt-6 border-t border-primary/10">
                  {isAuthenticated ? (
                    <>
                      <Button variant="primary" asChild className="w-full">
                        <Link href={dashboardHref} onClick={closeMenu}>Mon espace</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <button onClick={handleLogoutClick}>Se déconnecter</button>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login" onClick={closeMenu}>Connexion</Link>
                      </Button>
                      <Button variant="primary" asChild className="w-full">
                        <Link href="/register/user" onClick={closeMenu}>Inscription</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {modalOpen && (
        <LogoutConfirmModal onConfirm={confirmLogout} onCancel={cancelLogout} loading={logoutLoading} />
      )}
    </>
  );
}