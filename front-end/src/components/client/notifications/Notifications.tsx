'use client';

import { useEffect, useState } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle2, CheckCheck } from 'lucide-react';
import { api } from '@/lib/api';

interface NotificationItem {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  is_read: boolean;
  created_at: string;
}

const TYPE_ICONS = { info: Info, warning: AlertTriangle, success: CheckCircle2 };
const TYPE_STYLES = {
  info: 'text-[#586062] bg-[#dae1e3]',
  warning: 'text-[#7a4b00] bg-[#ffddb9]',
  success: 'text-green-700 bg-green-100',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('client/notifications')
      .then((res) => setNotifications(res.data ?? res))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await api.put(`client/notifications/${id}/read`);
    } catch {
      load();
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await Promise.all(
        notifications.filter((n) => !n.is_read).map((n) => api.put(`client/notifications/${n.id}/read`))
      );
    } catch {
      load();
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const timeAgo = (iso: string) => {
    const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    return `Il y a ${Math.floor(diffH / 24)} jours`;
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1d1b17]">Notifications</h2>
          <p className="text-[#58423d]">
            {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : 'Tout est à jour'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 border border-[#dfc0ba] rounded-full text-sm font-semibold hover:bg-[#f3ede6] transition-colors"
          >
            <CheckCheck className="w-4 h-4" strokeWidth={1.75} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading && <p className="text-[#58423d]">Chargement...</p>}

      {!loading && notifications.length === 0 && (
        <div className="bg-white border border-[#dfc0ba] rounded-xl p-10 flex flex-col items-center text-center">
          <Bell className="w-8 h-8 text-[#8b716c] mb-2" strokeWidth={1.5} />
          <p className="text-[#58423d]">Aucune notification pour le moment.</p>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = TYPE_ICONS[n.type];
          return (
            <div
              key={n.id}
              onClick={() => !n.is_read && handleMarkAsRead(n.id)}
              className={`bg-white border rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-colors ${
                n.is_read ? 'border-[#dfc0ba]' : 'border-[#9b2f1e]/30 bg-[#fef8f1]'
              }`}
            >
              <span className={`p-2 rounded-lg shrink-0 ${TYPE_STYLES[n.type]}`}>
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <p className={`font-semibold ${!n.is_read ? 'text-[#1d1b17]' : 'text-[#58423d]'}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-[#8b716c] shrink-0">{timeAgo(n.created_at)}</span>
                </div>
                {n.content && <p className="text-sm text-[#58423d] mt-1">{n.content}</p>}
              </div>
              {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#9b2f1e] mt-2 shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}