// components/admin/ai/CatererAiCheck.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { api } from '@/lib/api';

interface Result {
  checks: { label: string; ok: boolean }[];
  ai: {
    risk_level?: 'low' | 'medium' | 'high';
    summary?: string;
    concerns?: string[];
    suggested_action?: 'approve' | 'request_info' | 'review_manually';
  };
}

const RISK = {
  low: { label: 'Risque faible', style: 'bg-green-100 text-green-800' },
  medium: { label: 'Risque moyen', style: 'bg-amber-100 text-amber-800' },
  high: { label: 'Risque élevé', style: 'bg-red-100 text-red-800' },
};

const ACTION = {
  approve: 'Le profil semble pouvoir être validé.',
  request_info: 'Demander des précisions au traiteur avant de valider.',
  review_manually: 'À examiner attentivement à la main.',
};

export default function CatererAiCheck({ catererId }: { catererId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await api.post(`admin/assistant/check-caterer/${catererId}`));
    } catch (err: any) {
      setError(err.message || "L'analyse a échoué.");
    } finally {
      setLoading(false);
    }
  };

  const risk = result?.ai.risk_level ? RISK[result.ai.risk_level] : null;

  return (
    <div>
      <button
        onClick={run}
        disabled={loading}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4" strokeWidth={1.75} />
        {loading ? 'Analyse...' : result ? "Relancer l'analyse" : 'Analyse IA'}
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {result && (
        <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
          <ul className="space-y-1">
            {result.checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-sm">
                {c.ok ? (
                  <Check className="w-4 h-4 text-green-600" strokeWidth={2} />
                ) : (
                  <X className="w-4 h-4 text-red-600" strokeWidth={2} />
                )}
                <span className={c.ok ? 'text-gray-700' : 'text-red-700'}>{c.label}</span>
              </li>
            ))}
          </ul>

          {risk && <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${risk.style}`}>{risk.label}</span>}
          {result.ai.summary && <p className="text-sm text-gray-800">{result.ai.summary}</p>}

          {result.ai.concerns && result.ai.concerns.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-amber-800 space-y-1">
              {result.ai.concerns.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          )}

          {result.ai.suggested_action && (
            <p className="text-sm font-semibold text-gray-900">→ {ACTION[result.ai.suggested_action]}</p>
          )}

          <p className="text-xs text-gray-500">Aide à la décision automatique : c&apos;est vous qui validez ou refusez.</p>
        </div>
      )}
    </div>
  );
}