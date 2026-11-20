// components/client/quotes/QuoteCompareModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles, Star, Check, AlertTriangle, HelpCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface QuoteMeta {
  id: number;
  company_name: string;
  rating: number;
  price: number;
  guests: number;
  per_person: number | null;
}

interface Analysis {
  summary: string;
  quotes?: { quote_id: number; strengths?: string[]; watch_points?: string[] }[];
  questions?: string[];
  best_value_quote_id?: number | null;
  best_value_reason?: string;
}

const fmt = (n: number) => `${Number(n).toLocaleString('fr-FR')} €`;

export default function QuoteCompareModal({ quoteIds, onClose }: { quoteIds: number[]; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<QuoteMeta[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const run = () => {
    setLoading(true);
    setError(null);
    api
      .post('client/assistant/compare-quotes', { quote_ids: quoteIds })
      .then((res) => {
        setMeta(res.quotes ?? []);
        setAnalysis(res.analysis);
      })
      .catch((err: any) => setError(err.message || 'La comparaison a échoué.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detailFor = (id: number) => analysis?.quotes?.find((q) => q.quote_id === id);

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        <div className="p-5 border-b border-[#dfc0ba] flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#9b2f1e]" strokeWidth={1.75} />
            <h3 className="text-xl font-bold text-[#1d1b17]">Comparaison des devis</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#ede7e0] rounded-full" aria-label="Fermer">
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="p-5">
          {loading && <p className="text-[#58423d] animate-pulse">Analyse des devis en cours...</p>}

          {error && (
            <div>
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <button onClick={run} className="text-sm font-semibold text-[#9b2f1e] hover:underline">
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && analysis && (
            <div className="space-y-5">
              <p className="text-sm text-[#1d1b17] whitespace-pre-wrap">{analysis.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meta.map((m) => {
                  const d = detailFor(m.id);
                  const best = analysis.best_value_quote_id === m.id;
                  return (
                    <div
                      key={m.id}
                      className={`border rounded-xl p-4 ${best ? 'border-[#9b2f1e] bg-[#fef8f1]' : 'border-[#dfc0ba]'}`}
                    >
                      {best && (
                        <span className="inline-block mb-2 px-2 py-0.5 rounded-full bg-[#9b2f1e] text-white text-[10px] font-bold uppercase">
                          Meilleur rapport apparent
                        </span>
                      )}
                      <p className="font-bold text-[#1d1b17]">{m.company_name}</p>
                      <div className="flex items-center gap-1 text-xs text-[#58423d] mb-2">
                        <Star className="w-3 h-3 text-[#7a4b00]" fill="#7a4b00" strokeWidth={1.5} />
                        {m.rating.toFixed(1)}
                      </div>
                      <p className="text-2xl font-bold text-[#9b2f1e]">{fmt(m.price)}</p>
                      <p className="text-xs text-[#58423d] mb-3">
                        {m.guests} invités{m.per_person !== null && ` · ${fmt(m.per_person)} / pers.`}
                      </p>

                      {d?.strengths && d.strengths.length > 0 && (
                        <ul className="space-y-1 mb-2">
                          {d.strengths.map((s, i) => (
                            <li key={i} className="flex gap-2 text-xs text-green-800">
                              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                      {d?.watch_points && d.watch_points.length > 0 && (
                        <ul className="space-y-1">
                          {d.watch_points.map((s, i) => (
                            <li key={i} className="flex gap-2 text-xs text-amber-800">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              {analysis.best_value_quote_id && analysis.best_value_reason && (
                <p className="text-sm text-[#58423d]">
                  <strong>Pourquoi ce choix apparent :</strong> {analysis.best_value_reason}
                </p>
              )}

              {analysis.questions && analysis.questions.length > 0 && (
                <div className="bg-[#f9f3ec] border border-[#dfc0ba] rounded-xl p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-[#1d1b17] mb-2">
                    <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
                    À demander aux traiteurs
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[#58423d]">
                    {analysis.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-[#8b716c]">
                Analyse automatique fondée uniquement sur les informations des devis. À vérifier avec les traiteurs
                avant de décider.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}