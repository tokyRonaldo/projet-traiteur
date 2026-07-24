// components/client/reviews/Reviews.tsx
'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquareText } from 'lucide-react';
import { api } from '@/lib/api';

interface PendingBooking {
  id: number;
  title: string;
  event_date: string;
  caterer: { company_name: string };
}

interface ReviewItem {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  caterer: { company_name: string };
}

export default function Reviews() {
  const [pending, setPending] = useState<PendingBooking[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('client/reviews/pending'), api.get('client/reviews')])
      .then(([p, r]) => {
        setPending(p.data ?? p);
        setReviews(r.data ?? r);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (bookingId: number) => {
    setSubmitting(true);
    try {
      await api.post('client/reviews/store', { booking_id: bookingId, rating, comment });
      setReviewingId(null);
      setRating(5);
      setComment('');
      loadData();
    } catch (err: any) {
      alert(err.message || "Impossible d'envoyer l'avis.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17]">Mes avis</h2>
        <p className="text-[#58423d]">Partagez votre expérience et aidez les autres clients.</p>
      </header>

      {!loading && pending.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-3">En attente de votre avis</h3>
          <div className="space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="bg-white border border-[#dfc0ba] rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{b.caterer.company_name}</p>
                    <p className="text-sm text-[#58423d]">
                      {b.title} — {new Date(b.event_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => setReviewingId(reviewingId === b.id ? null : b.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#9b2f1e] text-white rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors"
                  >
                    <MessageSquareText className="w-4 h-4" strokeWidth={1.75} />
                    Laisser un avis
                  </button>
                </div>

                {reviewingId === b.id && (
                  <div className="mt-4 pt-4 border-t border-[#dfc0ba] space-y-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => setRating(n)}>
                          <Star
                            className={`w-6 h-6 ${n <= rating ? 'text-[#7a4b00]' : 'text-[#e7e2db]'}`}
                            fill={n <= rating ? '#7a4b00' : 'none'}
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Décrivez votre expérience..."
                      rows={3}
                      className="w-full border border-[#dfc0ba] rounded-lg p-3 text-sm"
                    />
                    <button
                      onClick={() => handleSubmit(b.id)}
                      disabled={submitting}
                      className="px-4 py-2 bg-[#9b2f1e] text-white rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Envoi...' : "Publier l'avis"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-lg font-bold mb-3">Historique de mes avis</h3>
        {loading && <p className="text-[#58423d]">Chargement...</p>}
        {!loading && reviews.length === 0 && (
          <p className="text-[#58423d]">Vous n'avez pas encore laissé d'avis.</p>
        )}
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-[#dfc0ba] rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold">{r.caterer.company_name}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? 'text-[#7a4b00]' : 'text-[#e7e2db]'}`}
                      fill={i < r.rating ? '#7a4b00' : 'none'}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>
              {r.comment && <p className="text-sm text-[#58423d]">{r.comment}</p>}
              <p className="text-xs text-[#8b716c] mt-2">
                {new Date(r.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}