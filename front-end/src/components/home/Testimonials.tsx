// components/home/Testimonials.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface ReviewData {
  id: number;
  name: string;
  caterer_name: string;
  comment: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    api.get('public/reviews/featured').then(setReviews).catch(() => setReviews([]));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
          <div className="flex justify-center gap-1 text-secondary">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined fill-1">star</span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-primary/5">
              <div className="mb-4">
                <h5 className="font-bold">{r.name}</h5>
                <p className="text-xs opacity-60">Client de {r.caterer_name}</p>
              </div>
              <p className="italic text-lg leading-relaxed">&quot;{r.comment}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}