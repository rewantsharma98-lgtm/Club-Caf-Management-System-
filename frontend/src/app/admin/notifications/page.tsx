'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { api, NotificationItem } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDateTime } from '@/lib/utils';

export default function NotificationsPage() {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    recipientId: '',
    title: '',
    message: '',
    channel: 'in_app',
    type: 'promo',
  });

  const load = () => {
    const token = getToken();
    if (!token) return;
    api.getAdminNotifications(token).then((r) => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSending(true);
    setMsg('');
    try {
      await api.sendNotification(token, {
        recipientId: form.recipientId,
        title: form.title,
        message: form.message,
        channel: form.channel,
        type: form.type,
        alsoSend: form.channel !== 'in_app',
      });
      setMsg('Notification sent');
      setForm({ recipientId: '', title: '', message: '', channel: 'in_app', type: 'promo' });
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Send failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayoutShell title="Notifications">
      <motion.form
        onSubmit={send}
        className="surface-card rounded-lg p-6 mb-8 space-y-4 max-w-xl"
      >
        <h2 className="font-semibold text-cyan">Send Notification</h2>
        <input
          className="input-field"
          placeholder="Customer ID"
          value={form.recipientId}
          onChange={(e) => setForm({ ...form, recipientId: e.target.value })}
          required
        />
        <input
          className="input-field"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="input-field min-h-[80px]"
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <select
          className="input-field"
          value={form.channel}
          onChange={(e) => setForm({ ...form, channel: e.target.value })}
        >
          <option value="in_app">In-app</option>
          <option value="email">Email (stub)</option>
          <option value="sms">SMS (stub)</option>
          <option value="whatsapp">WhatsApp (stub)</option>
          <option value="push">Push (stub)</option>
        </select>
        <Button type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </Button>
        {msg && <p className="text-sm text-cyan">{msg}</p>}
      </motion.form>
      {loading ? (
        <motion.div className="flex justify-center py-20">
          <LoadingSpinner />
        </motion.div>
      ) : (
        <motion.div className="space-y-3">
          {data.map((n) => (
            <motion.div key={n._id} className="rounded-xl glass p-4">
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-cream-muted">{n.message}</p>
              <p className="text-xs text-slate mt-2">{formatDateTime(n.createdAt)}</p>
            </motion.div>
          ))}
          {!data.length && (
            <p className="text-slate text-center py-12">No notifications sent yet.</p>
          )}
        </motion.div>
      )}
    </AdminLayoutShell>
  );
}
