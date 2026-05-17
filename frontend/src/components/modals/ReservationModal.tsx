'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api, ReservationInput, VenueTable } from '@/lib/api';
import { getMinDate } from '@/lib/utils';
import { BRAND } from '@/lib/brand';
import { useHomeUI } from '@/context/HomeUIContext';
import { Users, Check } from 'lucide-react';

const timeSlots = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00',
];

export default function ReservationModal() {
  const router = useRouter();
  const { reserveOpen, closeReserve } = useHomeUI();
  const [loading, setLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tables, setTables] = useState<VenueTable[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<ReservationInput>({
    customerName: '',
    phone: '',
    email: '',
    date: '',
    time: '20:00',
    guests: 2,
    seatingPreference: 'Indoor',
    specialRequest: '',
    table: undefined,
  });

  const loadTables = useCallback(async () => {
    if (!form.date || !form.time || !form.guests) {
      setTables([]);
      return;
    }
    setTablesLoading(true);
    try {
      const res = await api.getAvailableTables({
        date: new Date(form.date + 'T12:00:00').toISOString(),
        time: form.time,
        guests: String(form.guests),
      });
      setTables(res.data);
    } catch {
      setTables([]);
    } finally {
      setTablesLoading(false);
    }
  }, [form.date, form.time, form.guests]);

  useEffect(() => {
    if (!reserveOpen) return;
    const t = setTimeout(loadTables, 300);
    return () => clearTimeout(t);
  }, [reserveOpen, loadTables]);

  const update = (field: keyof ReservationInput, value: string | number | undefined) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '', submit: '' }));
    if (field !== 'table') {
      setForm((f) => ({ ...f, table: undefined }));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!form.phone.match(/^[\d\s+\-()]{7,20}$/)) e.phone = 'Valid phone required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.date) e.date = 'Date is required';
    else if (form.date < getMinDate()) e.date = 'Cannot book past dates';
    if (!form.time) e.time = 'Time is required';
    if (form.guests < 1 || form.guests > 50) e.guests = 'Guests must be 1–50';
    if (!form.table) e.table = 'Please select a table';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.createReservation({
        ...form,
        date: new Date(form.date + 'T12:00:00').toISOString(),
      });
      sessionStorage.setItem(BRAND.confirmKey, JSON.stringify(res.data));
      closeReserve();
      router.push('/confirmation');
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Booking failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={reserveOpen}
      onClose={closeReserve}
      title="Reserve your table"
      subtitle={`${BRAND.fullName} · Confirmation within the hour`}
      wide
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain space-y-6 px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Field label="Full name" error={errors.customerName}>
            <input
              className="input-field"
              value={form.customerName}
              onChange={(e) => update('customerName', e.target.value)}
              autoComplete="name"
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              className="input-field"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              autoComplete="tel"
            />
          </Field>
          <Field label="Email" error={errors.email} className="sm:col-span-2">
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label="Date" error={errors.date}>
            <input
              type="date"
              className="input-field"
              min={getMinDate()}
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
            />
          </Field>
          <Field label="Time" error={errors.time}>
            <select
              className="input-field"
              value={form.time}
              onChange={(e) => update('time', e.target.value)}
            >
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Guests" error={errors.guests}>
            <input
              type="number"
              min={1}
              max={50}
              className="input-field"
              value={form.guests}
              onChange={(e) => update('guests', parseInt(e.target.value, 10) || 1)}
            />
          </Field>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate mb-3">
            Available tables
          </p>
          {errors.table && <p className="text-xs text-red-400 mb-2">{errors.table}</p>}
          {tablesLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          ) : !form.date ? (
            <p className="text-sm text-body py-4 text-center">Select a date and time to view tables.</p>
          ) : tables.length === 0 ? (
            <p className="text-sm text-body py-4 text-center">
              No tables match your party size. Try fewer guests or another time.
            </p>
          ) : (
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {tables.map((t) => {
                const selected = form.table === t._id;
                const disabled = !t.available;
                return (
                  <button
                    key={t._id}
                    type="button"
                    disabled={disabled}
                    onClick={() => update('table', t._id)}
                    className={`rounded-md border p-4 text-left transition-colors ${
                      disabled
                        ? 'border-border/50 opacity-40 cursor-not-allowed'
                        : selected
                          ? 'border-gold/50 bg-gold/10'
                          : 'border-border hover:border-gold/30 bg-surface'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-cream">{t.label}</p>
                        <p className="text-xs text-body mt-1">{t.zone}</p>
                        <p className="text-xs text-gold mt-1">{t.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="flex items-center gap-1 text-xs text-cream-muted">
                          <Users size={12} /> {t.capacity}
                        </p>
                        {selected && <Check size={16} className="text-gold ml-auto mt-2" />}
                        {!t.available && (
                          <span className="text-[10px] uppercase tracking-wider text-slate mt-2 block">
                            Booked
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Field label="Special request">
          <textarea
            className="input-field min-h-[80px] resize-none"
            value={form.specialRequest}
            onChange={(e) => update('specialRequest', e.target.value)}
            placeholder="Celebrations, allergies, seating notes…"
          />
        </Field>

        {errors.submit && <p className="text-sm text-red-400 text-center">{errors.submit}</p>}
        </div>

        <div className="shrink-0 border-t border-border bg-elevated px-4 py-4 sm:px-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button type="submit" disabled={loading} className="w-full min-h-[48px]">
            {loading ? 'Submitting…' : 'Confirm reservation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
