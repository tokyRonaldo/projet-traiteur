// app/admin/payments/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Badge from '@/components/admin/Badge';

export default function PaymentDetailPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    api.get(`admin/payment/show/${id}`).then(setPayment);
  }, [id]);

  if (!payment) return <p>Chargement...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Paiement #{payment.id}</h1>

      <div className="bg-white rounded-lg shadow p-4 space-y-2 text-sm">
        <p><strong>Utilisateur :</strong> {payment.user?.name} ({payment.user?.email})</p>
        <p><strong>Montant :</strong> {payment.amount} €</p>
        <p><strong>Transaction ID :</strong> {payment.transaction_id}</p>
        <p><strong>Statut :</strong> <Badge status={payment.status} /></p>
        <p><strong>Date :</strong> {new Date(payment.created_at).toLocaleDateString()}</p>

        {payment.subscription && (
          <p><strong>Abonnement :</strong> {payment.subscription.plan}</p>
        )}
        {payment.quote && (
          <p><strong>Devis lié :</strong> {payment.quote.proposed_price} € — {payment.quote.status}</p>
        )}
      </div>
    </div>
  );
}