// components/home/FeaturedCaterers.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CatererCard from '../ui/CatererCard';
import { api } from '@/lib/api';

interface CatererData {
  id: number;
  company_name: string;
  description: string;
  rating: number;
  average_price: number | null;
  logo_url: string | null;
}

export default function FeaturedCaterers() {
  const [caterers, setCaterers] = useState<CatererData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('public/caterers/featured')
      .then(setCaterers)
      .catch(() => setCaterers([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && caterers.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Traiteurs à la une</h2>
            <p className="opacity-60">Les mieux notés par nos clients</p>
          </div>
          <Link href="/caterer" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
            Voir tous <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <p className="opacity-60">Chargement...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {caterers.map((c) => (
              <CatererCard
                key={c.id}
                id={c.id}
                name={c.company_name}
                cuisine={c.description}
                rating={c.rating}
                price={c.average_price ?? 0}
                image={c.logo_url ?? ''}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}