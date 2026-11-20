// components/admin/ai/ReviewsAiScan.tsx
'use client';

import { useState } from 'react';
import { ShieldAlert, Star } from 'lucide-react';
import { api } from '@/lib/api';

interface Flagged {
  review: { id: number; rating: number; comment: string; created_at: string };
  category: string;
  reason: string;
}

const LABELS: Record<string, string> = {
  doublon: 'Doublon',
  spam: 'Spam',
  insulte: 'Insultes',
  hors_sujet: 'Hors sujet',
  incoherent: 'Incohérent',
  suspect: 'Suspect',
};

export default function ReviewsAiScan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ scanned: number; flagged: Flagged[] } | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await api.post('admin/assistant/scan-reviews'));
    } catch (err: any) {
      setError(err.message || "L'analyse a échoué.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">Avis suspects</p>
          <p className="text-xs text-gray-500">Analyse des 30 derniers avis. Aucun avis n&apos;est modifié.</p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-gray-900 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <ShieldAlert className="w-4 h-4" strokeWidth={1.75} />
          {loading ? 'Analyse...' : 'Repérer les avis suspects'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {result && (
        <div className="mt-4 space-y-2">
          {result.flagged.length === 0 ? (
            <p className="text-sm text-green-700">
              Aucun avis suspect parmi les {result.scanned} derniers avis analysés.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                {result.flagged.length} avis à examiner sur {result.scanned} analysés :
              </p>
              {result.flagged.map((f) => (
                <div key={f.review.id} className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold uppercase text-amber-800">{LABELS[f.category] ?? 'Suspect'}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Star className="w-3 h-3 text-amber-600" fill="currentColor" strokeWidth={1.5} />
                      {f.review.rating}/5 · avis n°{f.review.id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">« {f.review.comment} »</p>
                  <p className="text-xs text-gray-600 mt-1">{f.reason}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}