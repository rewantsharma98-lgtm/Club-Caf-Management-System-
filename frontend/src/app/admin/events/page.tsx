'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { api, EventItem, EventInput } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

const emptyForm: EventInput = {
  title: '',
  image: '',
  description: '',
  date: '',
  featured: true,
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState<EventInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await api.getEvents();
      setEvents(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (event: EventItem) => {
    setEditing(event);
    setForm({
      title: event.title,
      image: event.image,
      description: event.description,
      date: event.date.split('T')[0],
      featured: event.featured ?? true,
    });
    setModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      const body = { ...form, date: new Date(form.date).toISOString() };
      if (editing) {
        await api.updateEvent(token, editing._id, body);
      } else {
        await api.createEvent(token, body);
      }
      setModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    const token = getToken();
    if (!token) return;
    await api.deleteEvent(token, id);
    load();
  };

  return (
    <AdminLayoutShell title="Events">
      <div className="mb-6 flex justify-end">
        <Button onClick={openCreate}>
          <Plus size={18} /> Create Event
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event, i) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden surface-card rounded-lg"
            >
              <div className="relative h-40">
                <Image src={event.image} alt={event.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs text-cyan">{formatDate(event.date)}</p>
                <h3 className="mt-1 font-semibold">{event.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-cream-muted">{event.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(event)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-cyan hover:bg-cyan/10"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(event._id)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass-strong rounded-2xl p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editing ? 'Edit Event' : 'Create Event'}</h2>
                <button type="button" onClick={() => setModal(false)} className="text-cream-muted hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <input
                  className="input-field"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  required
                />
                <textarea
                  className="input-field min-h-[80px]"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                  type="date"
                  className="input-field"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayoutShell>
  );
}
