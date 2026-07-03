'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CatererPending = () => {
  const router = useRouter()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glow1 = document.querySelector('.bg-primary-fixed') as HTMLElement;
      const glow2 = document.querySelector('.bg-tertiary-fixed') as HTMLElement;

      const moveX = (e.clientX - window.innerWidth / 2) / 30;
      const moveY = (e.clientY - window.innerHeight / 2) / 30;

      if (glow1) glow1.style.transform = `translate(${moveX}px, ${moveY}px)`;
      if (glow2) glow2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="w-full top-0 sticky bg-surface border-b border-outline-variant shadow-sm z-50">
        <div className="max-w-[1440px] flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
          <div className="font-headline-md text-primary font-bold text-headline-md">
            Saffron Hearth
          </div>

          <div className="flex items-center gap-lg">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhGYur_nL5wzKL2nQVr7WlzK-Jz36YFml7oNGstaDlgWm-lPUpukoU_Iz00cEtuXcDMdXqJW-FHPJpUZ0rS6oRroBDCv3th_JDQUy07FDcAhfMumoKU0M6ARW5vKnA1u-8cjUueyQq9SqqfO1DUvRyplGHM7m7hd8DjxzsBX7awOaIPy4dVyTli2yESzysxqoYuzG3Va8tIX6G648EZphdUOA_I9Ko-v2e_v116vpWU_JLSY4pdqseMbaQ55_Gq_HktvRXUYdcPSUe"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-grow relative flex flex-col items-center justify-center px-gutter py-xl">

        {/* Background glow */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary-fixed opacity-20 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-tertiary-fixed opacity-20 blur-3xl rounded-full -z-10"></div>

        <div className="max-w-4xl w-full flex flex-col items-center text-center">

          {/* Icon */}
          <div className="mb-lg">
            <div className="relative w-40 h-40 flex items-center justify-center bg-surface-container rounded-full shadow-md border border-outline-variant">
              <div className="absolute inset-0 border-2 border-primary border-dashed rounded-full animate-spin opacity-30"></div>

              <span className="material-symbols-outlined text-[80px] text-primary">
                hourglass_top
              </span>

              <div className="absolute -bottom-2 -right-2 bg-tertiary text-white px-4 py-1 rounded-full text-xs">
                EN COURS
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-primary mb-2">
            Merci pour votre inscription !
          </h1>

          <p className="text-on-surface-variant max-w-2xl">
            Votre profil de traiteur est en cours de validation par notre équipe.
          </p>

          {/* Timeline */}
          <div className="w-full max-w-3xl mt-10">
            <div className="p-6 rounded-xl border border-outline-variant bg-white/60 backdrop-blur">

              <div className="flex justify-between text-center relative">

                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                    ✓
                  </div>
                  <span>Account Created</span>
                </div>

                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center ring-4 ring-primary/20">
                    🔒
                  </div>
                  <span className="font-bold text-primary">Verification</span>
                </div>

                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    🚀
                  </div>
                  <span>Launch</span>
                </div>

              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="/" className="bg-primary text-white px-6 py-3 rounded-full">
              <Link href="/">
              Retour à l'accueil
              </Link>
            </a>

            <button className="border border-primary text-primary px-6 py-3 rounded-full">
              Contact Support
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-10 border-t border-outline-variant text-center">
        <p className="text-sm text-on-surface-variant">
          © 2024 Saffron Hearth
        </p>
      </footer>

    </div>
  );
};

export default CatererPending;