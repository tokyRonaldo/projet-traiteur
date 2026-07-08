// components/caterer/reviews/Reviews.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Star,
  Reply,
  ThumbsUp,
  Flag,
  Pencil,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from 'lucide-react';
import { api } from '@/lib/api';

interface ReviewItem {
  id: number;
  client_name: string;
  event_type: string;
  rating: number;
  comment: string | null;
  created_at: string;
  caterer_reply: { content: string; created_at: string } | null;
  has_photos: boolean;
}

const FILTERS = [
  { key: 'all', label: 'Tous les avis' },
  { key: 'unanswered', label: 'Non répondus' },
  { key: 'five_stars', label: '5 étoiles' },
  { key: 'with_photos', label: 'Photos incluses' },
];

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [openReplyId, setOpenReplyId] = useState<number | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    setLoading(true);
    api
      .get('caterer/reviews') // adapte à ta vraie route
      .then((res) => setReviews(res.data ?? res))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'unanswered':
        return reviews.filter((r) => !r.caterer_reply);
      case 'five_stars':
        return reviews.filter((r) => r.rating === 5);
      case 'with_photos':
        return reviews.filter((r) => r.has_photos);
      default:
        return reviews;
    }
  }, [reviews, filter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { star, percent };
  });

  const responseRate = reviews.length
    ? Math.round((reviews.filter((r) => r.caterer_reply).length / reviews.length) * 100)
    : 0;

  const handleReplyChange = (id: number, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = async (review: ReviewItem) => {
    const content = replyDrafts[review.id];
    if (!content?.trim()) return;

    try {
      await api.post(`caterer/reviews/${review.id}/reply`, { content });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? { ...r, caterer_reply: { content, created_at: new Date().toISOString() } }
            : r
        )
      );
      setOpenReplyId(null);
      setReplyDrafts((prev) => ({ ...prev, [review.id]: '' }));
    } catch {
      // gérer l'échec si besoin
    }
  };

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const timeAgo = (iso: string) => {
    const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17]">Avis & Notes</h2>
        <p className="text-[#58423d]">Gérez votre réputation et interagissez avec vos clients.</p>
      </header>

      {/* Résumé */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        {/* Note principale */}
        <div className="md:col-span-4 bg-white border border-[#dfc0ba] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-5xl font-bold text-[#9b2f1e]">{avgRating}</span>
          <div className="flex gap-1 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(Number(avgRating)) ? 'text-[#7a4b00]' : 'text-[#e7e2db]'}`}
                fill={i < Math.round(Number(avgRating)) ? '#7a4b00' : 'none'}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <p className="text-[#58423d] font-medium">Basé sur {reviews.length} avis</p>
        </div>

        {/* Distribution */}
        <div className="md:col-span-5 bg-white border border-[#dfc0ba] rounded-xl p-6 flex flex-col justify-center shadow-sm">
          <h3 className="font-bold text-[#1d1b17] mb-4">Distribution des notes</h3>
          <div className="space-y-2">
            {distribution.map(({ star, percent }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="w-4 text-sm font-bold">{star}</span>
                <div className="flex-1 h-3 bg-[#ede7e0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#7a4b00] rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-10 text-right text-sm text-[#58423d]">{percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats complémentaires */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="bg-[#bc4733] text-white p-4 rounded-xl flex-1 flex flex-col justify-between">
            <MessageCircle className="w-6 h-6" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Taux de réponse</p>
              <p className="text-2xl font-bold">{responseRate}%</p>
            </div>
          </div>
          <div className="bg-[#f3ede6] text-[#1d1b17] p-4 rounded-xl flex-1 border border-[#dfc0ba] flex flex-col justify-between">
            <Clock className="w-6 h-6 text-[#9b2f1e]" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-bold text-[#58423d] opacity-80 uppercase tracking-wider">Délai de réponse</p>
              <p className="text-2xl font-bold">2h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <div className="flex items-center justify-between border-b border-[#dfc0ba] pb-2 mb-4">
        <div className="flex gap-4 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`px-3 py-2 font-bold whitespace-nowrap transition-colors ${
                filter === f.key
                  ? 'text-[#9b2f1e] border-b-2 border-[#9b2f1e]'
                  : 'text-[#58423d] hover:text-[#1d1b17]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des avis */}
      <div className="grid grid-cols-1 gap-4">
        {loading && <p className="text-[#58423d]">Chargement des avis...</p>}

        {!loading && paginated.length === 0 && (
          <p className="text-[#58423d] py-8 text-center">Aucun avis dans cette catégorie.</p>
        )}

        {paginated.map((review) => (
          <article key={review.id} className="bg-white border border-[#dfc0ba] rounded-xl p-6 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-[#dae1e3] flex items-center justify-center text-[#586062] font-bold text-lg shrink-0">
                  {initials(review.client_name)}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{review.client_name}</h4>
                  <p className="text-sm text-[#58423d]">
                    {review.event_type} • {timeAgo(review.created_at)}
                  </p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-[#7a4b00]' : 'text-[#e7e2db]'}`}
                        fill={i < review.rating ? '#7a4b00' : 'none'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {!review.comment && !review.caterer_reply && (
                <button
                  onClick={() => setOpenReplyId(openReplyId === review.id ? null : review.id)}
                  className="text-[#9b2f1e] font-bold flex items-center gap-1 hover:underline shrink-0"
                >
                  <Reply className="w-4 h-4" strokeWidth={1.75} />
                  Remercier
                </button>
              )}
            </div>

            {review.comment && <p className="text-[#1d1b17] mb-4">{review.comment}</p>}

            {review.has_photos && (
              <div className="flex gap-3 mb-4">
                <div className="w-20 h-20 rounded-lg bg-[#f3ede6] border border-[#dfc0ba] flex items-center justify-center">
                  <ImageOff className="w-5 h-5 text-[#8b716c]" strokeWidth={1.5} />
                </div>
                <div className="w-20 h-20 rounded-lg bg-[#f3ede6] border border-[#dfc0ba] flex items-center justify-center">
                  <ImageOff className="w-5 h-5 text-[#8b716c]" strokeWidth={1.5} />
                </div>
              </div>
            )}

            {/* Réponse existante */}
            {review.caterer_reply && (
              <div className="mt-3 p-4 bg-[#ede7e0] rounded-lg border-l-4 border-[#9b2f1e]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[#9b2f1e] text-sm">Votre réponse</span>
                  <span className="text-xs text-[#58423d]">{timeAgo(review.caterer_reply.created_at)}</span>
                </div>
                <p className="text-sm text-[#1d1b17] italic">{review.caterer_reply.content}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#dfc0ba]">
              {review.comment && !review.caterer_reply && (
                <button
                  onClick={() => setOpenReplyId(openReplyId === review.id ? null : review.id)}
                  className="text-[#9b2f1e] font-bold flex items-center gap-1 hover:underline"
                >
                  <Reply className="w-4 h-4" strokeWidth={1.75} />
                  Répondre
                </button>
              )}
              {review.caterer_reply && (
                <button
                  onClick={() => {
                    setOpenReplyId(review.id);
                    setReplyDrafts((prev) => ({ ...prev, [review.id]: review.caterer_reply!.content }));
                  }}
                  className="text-[#9b2f1e] font-bold flex items-center gap-1 hover:underline"
                >
                  <Pencil className="w-4 h-4" strokeWidth={1.75} />
                  Modifier la réponse
                </button>
              )}
              {!review.comment && review.caterer_reply && <span />}

              <div className="flex gap-2">
                <button className="p-2 text-[#58423d] hover:text-[#9b2f1e] transition-colors">
                  <ThumbsUp className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button className="p-2 text-[#58423d] hover:text-red-600 transition-colors">
                  <Flag className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Zone de réponse */}
            {openReplyId === review.id && (
              <div className="mt-4 p-4 bg-[#f9f3ec] rounded-lg border border-[#dfc0ba]">
                <textarea
                  value={replyDrafts[review.id] ?? ''}
                  onChange={(e) => handleReplyChange(review.id, e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  className="w-full bg-white border border-[#dfc0ba] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none mb-2 h-24"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setOpenReplyId(null)}
                    className="px-4 py-1.5 text-sm font-bold text-[#58423d]"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSendReply(review)}
                    className="px-4 py-1.5 text-sm font-bold bg-[#9b2f1e] text-white rounded-full hover:bg-[#872111] transition-colors"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <nav className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-[#dfc0ba] rounded-full text-[#58423d] hover:bg-[#f3ede6] transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-full font-bold transition-colors ${
                  page === p ? 'bg-[#9b2f1e] text-white' : 'border border-[#dfc0ba] text-[#58423d] hover:bg-[#f3ede6]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-[#dfc0ba] rounded-full text-[#58423d] hover:bg-[#f3ede6] transition-all disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </nav>
      )}
    </div>
  );
}