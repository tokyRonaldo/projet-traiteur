// components/client/dashboard/DashboardGrid.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle, Heart, PlusCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface ActiveRequest {
  id: number;
  event_type: string;
  guests_number: number;
  event_date: string;
  status: string;
  quotes_count: number;
}

interface RecentMessage {
  id: number;
  sender_name: string;
  preview: string;
  sent_at: string;
  is_read: boolean;
}

interface UpcomingBooking {
  id: number;
  title: string;
  event_date: string;
  caterer_name: string;
  tasks_done: number;
  tasks_total: number;
}

interface FavoriteCaterer {
  id: number;
  company_name: string;
  price_range: string;
  logo_url: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente de devis',
  responded: 'Devis reçu — à consulter',
  accepted: 'Confirmé',
};

export default function DashboardGrid() {
  const [clientName, setClientName] = useState('');
  const [activeRequests, setActiveRequests] = useState<ActiveRequest[]>([]);
  const [messages, setMessages] = useState<RecentMessage[]>([]);
  const [nextBooking, setNextBooking] = useState<UpcomingBooking | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCaterer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('user'),
      api.get('client/requests?status=active'),
      api.get('client/messages/recent'),
      api.get('client/bookings/next'),
      api.get('client/favorites?limit=2'),
    ])
      .then(([user, requests, msgs, booking, favs]) => {
        setClientName(user.name);
        setActiveRequests(requests.data ?? requests);
        setMessages(msgs.data ?? msgs);
        setNextBooking(booking ?? null);
        setFavorites(favs.data ?? favs);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const daysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    return diff;
  };

  if (loading) return <p className="text-[#58423d]">Chargement...</p>;

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-[#1d1b17] mb-1">
          Bienvenue, {clientName || '...'}
        </h1>
        <p className="text-[#58423d]">Voici ce qui se passe avec vos événements aujourd&apos;hui.</p>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* Demandes actives */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-[#dfc0ba] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Demandes actives</h2>
            <Link href="/client/requests" className="text-[#9b2f1e] text-sm font-semibold hover:underline">
              Tout voir
            </Link>
          </div>

          {activeRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#58423d] mb-3">Vous n&apos;avez aucune demande active.</p>
              <Link
                href="/client/requests/new"
                className="inline-flex items-center gap-2 text-[#9b2f1e] font-semibold hover:underline"
              >
                <PlusCircle className="w-4 h-4" strokeWidth={1.75} />
                Créer une demande
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/client/requests/${req.id}`}
                  className="flex items-center p-4 border border-[#dfc0ba] rounded-lg hover:bg-[#f9f3ec] transition-colors group"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{req.event_type}</h3>
                    <p className="text-sm text-[#58423d]">
                      {req.guests_number} invités • {new Date(req.event_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <span className="inline-block bg-[#ffdad4] text-[#9b2f1e] text-[10px] px-2 py-1 rounded-full font-bold uppercase mb-1">
                      {STATUS_LABELS[req.status] ?? req.status}
                    </span>
                    <p className="text-xs text-[#58423d]">
                      {req.quotes_count} devis reçu{req.quotes_count > 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#9b2f1e] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.75} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Messages récents */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-[#dfc0ba] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Messages</h2>
            {messages.filter((m) => !m.is_read).length > 0 && (
              <span className="bg-[#9b2f1e] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {messages.filter((m) => !m.is_read).length}
              </span>
            )}
          </div>

          {messages.length === 0 ? (
            <p className="text-sm text-[#58423d] text-center py-6">Aucun message récent.</p>
          ) : (
            <div className="space-y-4">
              {messages.slice(0, 3).map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.is_read ? 'opacity-60' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-[#f3ede6] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#58423d]" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{msg.sender_name}</p>
                    <p className="text-sm text-[#58423d] line-clamp-1">{msg.preview}</p>
                    <p className="text-[10px] text-[#8b716c] mt-1 uppercase tracking-wider">
                      {new Date(msg.sent_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/client/messages"
            className="w-full mt-6 py-2 border border-[#9b2f1e] text-[#9b2f1e] rounded-lg text-sm font-semibold hover:bg-[#ffdad4]/30 transition-colors flex items-center justify-center"
          >
            Aller à la messagerie
          </Link>
        </div>

        {/* Prochaine réservation */}
        {nextBooking && (
          <div className="col-span-12 bg-[#9b2f1e] rounded-xl p-8 relative overflow-hidden text-white shadow-lg">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-sm uppercase tracking-wider">
                  Prochaine réservation • dans {daysUntil(nextBooking.event_date)} jour(s)
                </span>
                <h2 className="text-3xl font-bold mb-4">{nextBooking.title}</h2>
                <div className="flex gap-8">
                  <div>
                    <p className="text-white/60 text-xs mb-1 uppercase tracking-wider">Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(nextBooking.event_date).toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1 uppercase tracking-wider">Traiteur</p>
                    <p className="text-lg font-semibold">{nextBooking.caterer_name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <h4 className="text-sm font-bold mb-3">Avancement de la préparation</h4>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{
                      width: `${nextBooking.tasks_total > 0 ? (nextBooking.tasks_done / nextBooking.tasks_total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-white/80">
                  {nextBooking.tasks_done} / {nextBooking.tasks_total} étapes complétées
                </p>
                <Link
                  href={`/client/bookings/${nextBooking.id}`}
                  className="inline-block mt-3 text-sm font-semibold underline"
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Traiteurs favoris */}
        <div className="col-span-12 lg:col-span-6 bg-white border border-[#dfc0ba] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Traiteurs favoris</h2>
            <Link href="/client/favorites" className="text-[#9b2f1e] text-sm font-semibold hover:underline">
              Tout voir
            </Link>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-8 h-8 text-[#8b716c] mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-sm text-[#58423d]">Aucun traiteur en favori pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favorites.map((f) => (
                <Link
                  key={f.id}
                  href={`/client/caterers/${f.id}`}
                  className="group"
                >
                  <div className="h-28 rounded-lg overflow-hidden mb-2 bg-[#f3ede6] flex items-center justify-center relative">
                    {f.logo_url ? (
                      <img
                        src={f.logo_url}
                        alt={f.company_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-[#9b2f1e]">
                        {f.company_name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div className="absolute top-2 right-2 bg-white p-1 shadow-md rounded-full">
                      <Heart className="w-3.5 h-3.5 text-[#9b2f1e]" fill="#9b2f1e" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="text-sm font-bold group-hover:text-[#9b2f1e] transition-colors">{f.company_name}</p>
                  <p className="text-xs text-[#58423d]">{f.price_range}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA nouvelle demande */}
        <div className="col-span-12 lg:col-span-6 bg-white border border-[#dfc0ba] rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
          <div className="w-16 h-16 bg-[#ffdad4] rounded-full flex items-center justify-center mb-4">
            <PlusCircle className="w-8 h-8 text-[#9b2f1e]" strokeWidth={1.75} />
          </div>
          <h2 className="text-lg font-bold mb-2">Planifiez votre prochain événement</h2>
          <p className="text-[#58423d] mb-6 max-w-sm">
            Envoyez rapidement des demandes à vos traiteurs favoris ou explorez de nouvelles offres.
          </p>
          <Link
            href="/client/requests/new"
            className="bg-[#9b2f1e] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 shadow-sm transition-all active:scale-95"
          >
            Nouvelle demande
          </Link>
        </div>
      </div>
    </div>
  );
}