// components/caterer/subscription/Subscription.tsx
'use client';

import { useEffect, useState } from 'react';
import { Crown, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface SubscriptionData {
  id: number;
  plan: 'basic' | 'premium';
  price: number;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'cancelled';
}

const PLANS = [
  {
    key: 'basic',
    name: 'Basic',
    price: 15,
    features: ['5 services maximum', 'Galerie limitée à 10 médias', 'Support par email'],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 39,
    features: ['Services illimités', 'Galerie illimitée', 'Support prioritaire', 'Mise en avant dans les recherches'],
  },
];

export default function Subscription() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadSubscription = () => {
    setLoading(true);
    api
      .get('caterer/subscription')
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const handleSubscribe = async (plan: string) => {
    if (!confirm(`Confirmer l'abonnement au plan ${plan} ?`)) return;
    setProcessing(true);
    try {
      await api.post('caterer/subscription/subscribe', { plan });
      loadSubscription();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) return;
    setProcessing(true);
    try {
      await api.put('caterer/subscription/cancel');
      loadSubscription();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-[#58423d]">Chargement...</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17]">Abonnement</h2>
        <p className="text-[#58423d]">Gérez votre plan et vos avantages sur la plateforme.</p>
      </div>

      {/* Abonnement actuel */}
      {subscription && subscription.status === 'active' ? (
        <div className="bg-[#9b2f1e] text-white rounded-xl p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8" strokeWidth={1.75} />
            <div>
              <p className="font-bold text-lg capitalize">Plan {subscription.plan}</p>
              <p className="text-sm opacity-90">
                Actif depuis le {new Date(subscription.start_date).toLocaleDateString('fr-FR')}
                {subscription.end_date &&
                  ` • Renouvellement le ${new Date(subscription.end_date).toLocaleDateString('fr-FR')}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={processing}
            className="px-4 py-2 bg-white text-[#9b2f1e] rounded-full text-sm font-bold hover:bg-[#f9f3ec] transition-colors disabled:opacity-50"
          >
            Annuler l'abonnement
          </button>
        </div>
      ) : (
        <div className="bg-[#f3ede6] border border-[#dfc0ba] rounded-xl p-6 mb-6">
          <p className="text-[#58423d]">
            Vous n'avez pas d'abonnement actif. Choisissez un plan ci-dessous pour débloquer plus de fonctionnalités.
          </p>
        </div>
      )}

      {/* Plans disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = subscription?.status === 'active' && subscription.plan === plan.key;
          return (
            <div
              key={plan.key}
              className={`bg-white border rounded-xl p-6 ${
                isCurrent ? 'border-[#9b2f1e] border-2' : 'border-[#dfc0ba]'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                {isCurrent && (
                  <span className="text-xs font-bold text-[#9b2f1e] bg-[#ffdad4] px-2 py-1 rounded-full">
                    Plan actuel
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold mb-4">
                {plan.price} € <span className="text-sm font-normal text-[#58423d]">/ mois</span>
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#58423d]">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" strokeWidth={1.75} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.key)}
                disabled={isCurrent || processing}
                className={`w-full py-2 rounded-full font-bold text-sm transition-colors ${
                  isCurrent
                    ? 'bg-[#e7e2db] text-[#58423d] cursor-not-allowed'
                    : 'bg-[#9b2f1e] text-white hover:bg-[#872111]'
                }`}
              >
                {isCurrent ? 'Plan actuel' : "S'abonner"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}