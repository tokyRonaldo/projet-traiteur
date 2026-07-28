'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  SquarePen,
  Phone,
  MoreVertical,
  CalendarPlus,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Send,
  FileText,
  Download,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Conversation {
  id: number;
  client_name: string;
  subject: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  online: boolean;
}

interface ChatMessage {
  id: number;
  sender: 'me' | 'other';
  content: string;
  sent_at: string;
  read: boolean;
  attachment?: { name: string; size: string };
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get('client/conversations') // adapte à ta vraie route
      .then((res) => {
        const list = res.data ?? res;
        setConversations(list);
        if (list.length > 0) setSelectedId(list[0].id);
      })
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api
      .get(`client/conversations/${selectedId}/messages`)
      .then((res) => setMessages(res.data ?? res))
      .catch(() => setMessages([]));
  }, [selectedId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = conversations.filter((c) =>
    c.client_name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleSend = async () => {
    if (!draft.trim() || !selectedId) return;

    const optimisticMessage: ChatMessage = {
      id: Date.now(),
      sender: 'me',
      content: draft,
      sent_at: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setDraft('');

    try {
      await api.post(`client/conversations/${selectedId}/messages`, { content: draft });
    } catch {
      // gérer l'échec d'envoi si besoin (retirer le message optimiste, afficher une erreur)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl border border-[#dfc0ba] overflow-hidden">
      {/* Liste des conversations */}
      <section className="w-80 border-r border-[#dfc0ba] bg-[#fef8f1] flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-[#dfc0ba]">
          <h2 className="text-lg font-bold text-[#9b2f1e]">Conversations</h2>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-[#ede7e0] rounded-full text-[#58423d]">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="p-3 border-b border-[#dfc0ba]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#dfc0ba] rounded-full text-sm outline-none focus:border-[#9b2f1e] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="p-4 text-sm text-[#58423d]">Chargement...</p>}

          {!loading && filteredConversations.length === 0 && (
            <p className="p-4 text-sm text-[#58423d]">Aucune conversation.</p>
          )}

          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`p-4 cursor-pointer transition-colors flex items-start gap-3 border-b border-[#dfc0ba]/50 ${
                selectedId === conv.id ? 'bg-[#bc4733]/10 border-r-4 border-r-[#9b2f1e]' : 'hover:bg-[#f3ede6]'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-[#dae1e3] flex items-center justify-center text-[#586062] font-bold text-sm">
                  {initials(conv.client_name)}
                </div>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm truncate">{conv.client_name}</h3>
                  <span className="text-xs text-[#58423d] shrink-0 ml-2">
                    {formatTime(conv.last_message_at)}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#9b2f1e] truncate">{conv.subject}</p>
                <p className="text-xs text-[#58423d] truncate">{conv.last_message}</p>
              </div>
              {conv.unread_count > 0 && (
                <div className="w-5 h-5 bg-[#7a4b00] text-white text-[10px] flex items-center justify-center rounded-full font-bold shrink-0">
                  {conv.unread_count}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Fenêtre de discussion */}
      <section className="flex-1 flex flex-col bg-[#f9f3ec]">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center text-[#58423d]">
            Sélectionnez une conversation pour commencer.
          </div>
        ) : (
          <>
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#dfc0ba] bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dae1e3] flex items-center justify-center text-[#586062] font-bold text-sm">
                  {initials(selectedConversation.client_name)}
                </div>
                <div>
                  <h3 className="font-bold leading-tight">{selectedConversation.client_name}</h3>
                  {selectedConversation.online && (
                    <p className="text-xs text-[#58423d] flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" /> En ligne
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-[#dfc0ba] rounded-full text-sm font-semibold hover:bg-[#f3ede6] transition-all">
                  <CalendarPlus className="w-4 h-4" strokeWidth={1.75} />
                  Planifier un rendez-vous
                </button>
                <button className="p-2 hover:bg-[#f3ede6] rounded-full text-[#58423d]">
                  <Phone className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button className="p-2 hover:bg-[#f3ede6] rounded-full text-[#58423d]">
                  <MoreVertical className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.length === 0 && (
                <p className="text-center text-sm text-[#58423d]">Aucun message pour l'instant.</p>
              )}

              {messages.map((msg) =>
                msg.attachment ? (
                  <div key={msg.id} className="self-center w-full max-w-md bg-white border border-[#dfc0ba] p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#ffddb9]/40 rounded-lg text-[#7a4b00]">
                        <FileText className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{msg.attachment.name}</p>
                        <p className="text-xs text-[#58423d]">{msg.attachment.size}</p>
                      </div>
                      <button className="text-[#9b2f1e] hover:underline font-bold text-xs uppercase flex items-center gap-1">
                        <Download className="w-3 h-3" strokeWidth={2} />
                        Télécharger
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 max-w-[75%] ${
                      msg.sender === 'me' ? 'self-end flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`p-4 shadow-sm ${
                        msg.sender === 'me'
                          ? 'bg-[#bc4733] text-white rounded-2xl rounded-br-sm'
                          : 'bg-white border border-[#dfc0ba] text-[#1d1b17] rounded-2xl rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span
                        className={`text-[10px] block mt-2 ${
                          msg.sender === 'me' ? 'text-white/80 text-right' : 'text-[#58423d]'
                        }`}
                      >
                        {formatTime(msg.sent_at)}
                        {msg.sender === 'me' && msg.read ? ' · Lu' : ''}
                      </span>
                    </div>
                  </div>
                )
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-[#dfc0ba] shrink-0">
              <div className="bg-[#f9f3ec] border border-[#dfc0ba] rounded-2xl p-2 focus-within:border-[#9b2f1e] transition-colors">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrivez votre message..."
                  rows={2}
                  className="w-full bg-transparent border-none outline-none resize-none text-sm px-3 py-2"
                />
                <div className="flex items-center justify-between border-t border-[#dfc0ba]/50 mt-2 pt-2 px-1">
                  <div className="flex gap-1">
                    <button className="p-2 text-[#58423d] hover:bg-[#ede7e0] rounded-lg transition-all">
                      <Paperclip className="w-5 h-5" strokeWidth={1.75} />
                    </button>
                    <button className="p-2 text-[#58423d] hover:bg-[#ede7e0] rounded-lg transition-all">
                      <Smile className="w-5 h-5" strokeWidth={1.75} />
                    </button>
                    <button className="p-2 text-[#58423d] hover:bg-[#ede7e0] rounded-lg transition-all">
                      <ImageIcon className="w-5 h-5" strokeWidth={1.75} />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="bg-[#9b2f1e] text-white p-2.5 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                  >
                    <Send className="w-5 h-5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}