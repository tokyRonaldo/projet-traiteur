// components/caterer/quotes/AiDraftButton.tsx
'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { api } from '@/lib/api';

interface AiDraftButtonProps {
  quoteId?: number;
  eventRequestId?: number;
  price?: number | string;
  onUse: (text: string) => void;
}

export default function AiDraftButton({ quoteId, eventRequestId, price, onUse }: AiDraftButtonProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [tone, setTone] = useState<'chaleureux' | 'formel'>('chaleureux');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('caterer/assistant/draft-quote-message', {
        quote_id: quoteId,
        event_request_id: eventRequestId,
        proposed_price: price === '' || price === undefined ? undefined : Number(price),
        tone,
      });
      setDraft(res.message);
    } catch (err: any) {
      setError(err.message || 'Impossible de rédiger le message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#9b2f1e] hover:bg-[#9b2f1e]/10 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" strokeWidth={1.75} />
          {loading ? 'Rédaction...' : draft ? 'Régénérer' : "Rédiger avec l'IA"}
        </button>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value as 'chaleureux' | 'formel')}
          className="text-xs border border-[#dfc0ba] rounded-full px-2 py-1 bg-white text-[#58423d]"
          aria-label="Ton du message"
        >
          <option value="chaleureux">Chaleureux</option>
          <option value="formel">Formel</option>
        </select>
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      {draft && (
        <div className="mt-3 p-3 bg-[#fef8f1] border border-[#dfc0ba] rounded-lg">
          <p className="text-sm text-[#1d1b17] whitespace-pre-wrap">{draft}</p>
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                onUse(draft);
                setDraft(null);
              }}
              className="text-xs font-bold bg-[#9b2f1e] text-white px-3 py-1.5 rounded-full hover:bg-[#872111] transition-colors"
            >
              Utiliser ce texte
            </button>
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-1 text-xs font-semibold text-[#58423d] px-2 py-1.5 hover:bg-[#f3ede6] rounded-full disabled:opacity-50"
            >
              <RefreshCw className="w-3 h-3" strokeWidth={1.75} />
              Autre version
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="ml-auto p-1 text-[#58423d] hover:bg-[#f3ede6] rounded-full"
              aria-label="Fermer l'aperçu"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}