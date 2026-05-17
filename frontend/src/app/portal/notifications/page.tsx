'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, NotificationItem } from '@/lib/api';
import { getPortalToken } from '@/lib/portalAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils';

export default function PortalNotificationsPage() {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = getPortalToken();
    if (!token) return;
    api.portalNotifications(token).then((r) => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    const token = getPortalToken();
    if (!token) return;
    await api.portalMarkNotificationRead(token, id);
    setData((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };

  const markAll = async () => {
    const token = getPortalToken();
    if (!token) return;
    await api.portalMarkAllNotificationsRead(token);
    setData((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unread = data.filter((n) => !n.read).length;

  if (loading) {
    return (
      <motion.div className="flex justify-center py-20">
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-6">
      <motion.div className="flex items-center justify-between">
        <h1 className="heading-lg">Notifications</h1>
        {unread > 0 && (
          <Button type="button" variant="ghost" onClick={markAll}>
            Mark all read ({unread})
          </Button>
        )}
      </motion.div>
      <motion.div className="space-y-3">
        {data.map((n, i) => (
          <motion.button
            key={n._id}
            type="button"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => !n.read && markRead(n._id)}
            className={`w-full text-left rounded-xl glass p-4 ${
              !n.read ? 'border-l-2 border-gold cursor-pointer' : 'opacity-70'
            }`}
          >
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-cream-muted mt-1">{n.message}</p>
            <p className="text-xs text-slate mt-2">{formatDateTime(n.createdAt)}</p>
          </motion.button>
        ))}
        {!data.length && <p className="text-slate text-center py-12">No notifications yet.</p>}
      </motion.div>
    </motion.div>
  );
}
