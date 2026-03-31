'use client';

import { Button } from '../ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/img.png';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Assure-toi d'avoir lucide-react installé

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl border-b border-primary/10">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            LOGO
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Caterers</a>
            <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Categories</a>
            <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">How it Works</a>
            <a href="#" className="text-sm font-semibold hover:text-primary transition-colors">Blog</a>
          </div>

          {/* Boutons Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="primary" asChild>
              <Link href="/register/user">Register</Link>
            </Button>
          </div>

          {/* Bouton Hamburger (Mobile) */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden mt-6 pb-6 border-t border-primary/10">
            <div className="flex flex-col gap-6 text-center">
              <a 
                href="#" 
                className="text-lg font-semibold hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Caterers
              </a>
              <a 
                href="#" 
                className="text-lg font-semibold hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </a>
              <a 
                href="#" 
                className="text-lg font-semibold hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                How it Works
              </a>
              <a 
                href="#" 
                className="text-lg font-semibold hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </a>

              {/* Boutons Mobile */}
              <div className="flex flex-col gap-3 pt-4 border-t border-primary/10">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button variant="primary" asChild className="w-full">
                  <Link href="/register/user" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}