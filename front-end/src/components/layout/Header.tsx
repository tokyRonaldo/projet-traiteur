'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();

  console.log(user);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl border-b border-primary/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/">
              <span className="font-bold text-xl">LOGO</span>
            </Link>
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl border-b border-primary/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/">
            <span className="font-bold text-xl">LOGO</span>
          </Link>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Caterers</a>
          <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Categories</a>
          <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">How it Works</a>
          <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Blog</a>
        </div>

        {/* Buttons Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button variant="primary" asChild>
              <Link href="/dashboard">
                Manage my company
                {/* {user?.name && <span className="ml-1 opacity-80">({user.name})</span>} */}
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="primary" asChild>
                <Link href="/register/user">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Hamburger (Mobile) */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl text-foreground p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background-light dark:bg-background-dark border-b border-primary/10 shadow-lg">
            <div className="px-6 py-8 flex flex-col gap-6 text-center">
              {['Caterers', 'Categories', 'How it Works', 'Blog'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-lg font-semibold hover:text-primary transition-colors py-2"
                  onClick={closeMenu}
                >
                  {item}
                </a>
              ))}

              <div className="flex flex-col gap-3 pt-6 border-t border-primary/10">
                {isAuthenticated ? (
                  <Button variant="primary" asChild className="w-full">
                    <Link href="/dashboard" onClick={closeMenu}>
                      Manage my company
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={closeMenu}>Login</Link>
                    </Button>
                    <Button variant="primary" asChild className="w-full">
                      <Link href="/register/user" onClick={closeMenu}>Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}