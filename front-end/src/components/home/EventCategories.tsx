// components/home/EventCategories.tsx
'use client';

import { useEffect, useState } from 'react';
import CategoryCard from '../ui/CategoryCard';
import { api } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  type: string;
}

export default function EventCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('public/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section id="categories" className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">Un traiteur pour chaque événement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat) => (
            <CategoryCard
              key={cat.id}
              title={cat.name}
              description={cat.type === 'evenement' ? "Trouvez le traiteur idéal" : 'Découvrez cette spécialité'}
              image=""
            />
          ))}
        </div>
      </div>
    </section>
  );
}