// app/admin/caterers/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function CatererDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [caterer, setCaterer] = useState<any>(null);

  useEffect(() => {
    api.get(`admin/caterer/show/${id}`).then(setCaterer);
  }, [id]);

  const handleValidate = async () => {
    await api.get(`admin/caterer/update-status/${id}`);
    router.push('/admin/caterers/pending');
  };

  if (!caterer) return <p>Chargement...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{caterer.company_name}</h1>

      <div className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
        <p><strong>Description :</strong> {caterer.description}</p>
        <p><strong>Adresse :</strong> {caterer.address}</p>
        <p><strong>Ville :</strong> {caterer.location}</p>
        <p><strong>Email :</strong> {caterer.user?.email}</p>
        <p><strong>Téléphone :</strong> {caterer.user?.phone}</p>
        <p><strong>Statut :</strong> {caterer.verified ? 'Validé' : 'En attente'}</p>
      </div>

      {!caterer.verified && (
        <div className="flex gap-3">
          <button onClick={handleValidate} className="px-4 py-2 bg-green-600 text-white rounded">
            Valider
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded">
            Refuser
          </button>
        </div>
      )}
    </div>
  );
}