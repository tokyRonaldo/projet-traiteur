'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { api } from '@/lib/api';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Résume mon activité',
  'Quelles sont mes réservations à venir ?',
  'Quels devis sont en attente ?',
];

export default function AssistantChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const next: Msg[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      // on n'envoie que les 20 derniers messages
      const res = await api.post('caterer/assistant/chat', { messages: next.slice(-20) });
      setMessages([...next, { role: 'assistant', content: res.reply }]);
    } catch (err: any) {
      setMessages([
        ...next,
        { role: 'assistant', content: err.message || "L'assistant est indisponible pour le moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#9b2f1e] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#872111] transition-colors"
        >
          <Sparkles className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-sm font-semibold">Assistant</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[32rem] max-h-[80vh] bg-white border border-[#dfc0ba] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#9b2f1e] text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
              <span className="font-semibold text-sm">Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer">
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fef8f1]">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-[#58423d]">Que puis-je faire pour vous ?</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full text-left text-sm px-3 py-2 bg-white border border-[#dfc0ba] rounded-lg hover:bg-[#f9f3ec] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === 'user' ? 'bg-[#9b2f1e] text-white' : 'bg-white border border-[#dfc0ba] text-[#1d1b17]'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && <p className="text-xs text-[#58423d] animate-pulse">L&apos;assistant réfléchit...</p>}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-[#dfc0ba] flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Posez votre question..."
              maxLength={2000}
              className="flex-1 text-sm px-3 py-2 border border-[#dfc0ba] rounded-full outline-none focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e]"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="p-2 bg-[#9b2f1e] text-white rounded-full disabled:opacity-40"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}